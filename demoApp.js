const { ECDSAProvider, ValidatorMode } = require('@zerodev/sdk');
const { LocalAccountSigner } = require('@alchemy/aa-core');
const { encodeFunctionData, parseAbi, createPublicClient, http, stringToBytes, parseEther } = require('viem');
const { getNftEncodedData } = require('./openseaNftData');
require("dotenv").config();

//ZeroDev Project ID
const projectId = process.env.PROJECT_ID_SEPOLIA

//THE Executor contract we will be interacting with
const executorABI = parseAbi([
    'function transfer(address _receipient, uint _amount, address _validator, bytes calldata data) external'
]);

const kernelABI = parseAbi([
    'function setExecution(bytes4 _selector, address _executor, address _validator, uint48 _validUntil, uint48 _validAfter, bytes calldata _enableData) external payable',
]);


let selector, execAddress, validatorAddress, validUntil, validAfter, enableData;
selector = '0x92b4dfd2';//'0xbe45fd62';
execAddress = '0x2F8D2EF350bA3259977158caB11fE57599B293eE';
validatorAddress = '0x8E1232e9d68f3ee9F681a51637079D78b67CA244';
validUntil = 0; // is the timestamp at which the enabledData expires. When set to 0, it never expires
validAfter = 0; //is the timestamp at which the enabledData becomes active. When set to 0, it's immediately active

const encodeCardObject = ({ ownerAddress, openseaAddress, familyNFrenAlloc, nftAlloc, generalAlloc, familyNfrens }) => {
    let packedFnf = '';
    for (let fnf of familyNfrens) {
        packedFnf += fnf.substring(2);
    }
    const encodedData = ownerAddress + openseaAddress.substring(2) + familyNFrenAlloc + nftAlloc + generalAlloc + packedFnf;
    return encodedData;
}

const setExecution = async (owner, familyNFrenAlloc, nftAlloc, generalAlloc, familyNfrens, openseaAddress, _costOfNft) => {
    //create the AA wallet
    let ecdsaProvider = await ECDSAProvider.init({
        projectId,
        owner,
    });

    const address = await ecdsaProvider.getAddress();
    console.log('Smart wallet address:', address);

    const cardObject = {
        ownerAddress: await owner.getAddress(),
        openseaAddress: openseaAddress,
        familyNFrenAlloc: familyNFrenAlloc.toString(16).padStart(64, '0'),
        nftAlloc: nftAlloc.toString(16).padStart(64, '0'),
        generalAlloc: generalAlloc.toString(16).padStart(64, '0'),
        familyNfrens: familyNfrens
    };

    enableData = encodeCardObject(cardObject);
    //This is the UserOperation Calldata
    //Set the executor and validator for a specific function selector
    const { hash } = await ecdsaProvider.sendUserOperation({
        //The address here is the smart contract address after it has been deployed/created
        target: address,
        value: 0,
        data: encodeFunctionData({
            abi: kernelABI,
            functionName: 'setExecution',
            args: [selector, execAddress, validatorAddress, validUntil, validAfter, enableData]
        })
    })

    //This will wait for the user operation to be included in a transaction that's been mined.
    await ecdsaProvider.waitForUserOperationTransaction(hash);

    console.log("Validator and Executor set");

    return new Promise((resolve) => {
        resolve(address);
    });

}

//Address argument is the address of the smart wallet
const makeTransfer = async (_kernelAddress, _owner, _recipient, _amount, _data) => {
    //Set the AA wallet to plugin mode
    let ecdsaProvider = await ECDSAProvider.init({
        projectId,
        owner: _owner,
        opts: {
            validatorConfig: {
                mode: ValidatorMode.plugin,
            }
        }
    });

    console.log("Executing transaction");

    //This is the UserOperation Calldata
    //Set the executor and validator for a specific function selector
    const { hash } = await ecdsaProvider.sendUserOperation({
        //The address of our kernel contract
        //If you call a different contract other than the kernel contract, the calldata will be 
        //prepended with the functionSelector of the execute function in the Kernel contract and its parameters.
        target: _kernelAddress,
        data: encodeFunctionData({
            abi: executorABI,
            functionName: 'transfer',
            args: [_recipient, _amount, validatorAddress, _data]
        })
    })

    await ecdsaProvider.waitForUserOperationTransaction(hash);

}

const main = async () => {

    //The "owner of the AA wallet, which in this case is a private key"
    const owner = LocalAccountSigner.privateKeyToAccountSigner(process.env.PRIVATE_KEY)

    //Fund the wallet first before splitting,
    // because the contract checks that the sum of the splitted allocations must be less than the wallet balance
    let familyNFrenAlloc = parseEther('0.001');
    let nftAlloc = parseEther('0.01');
    let generalAlloc = parseEther('0.001');
    let familyNfrens = [
        '0x64d899379844d35a1a1f5d51d3185dd821f44dc1',
        '0x11d899379844d35a1a1f5d51d3185dd821f44d11',
        '0x22d899379844d35a1a1f5d51d3185dd821f44d11'
    ];
    let openseaAddress = '0x00000000000000ADc04C56Bf30aC9d3c0aAF14dC';
    let friendsAddress = '0x79d899379844d35a1a1f5d51d3185dd821f44dc1';
    const costOfNft = '0.01';
    const amount = '0x' + parseEther(costOfNft).toString(16).padStart(64, '0');
    const amount2 = '0x' + parseEther('0.001').toString(16).padStart(64, '0');

    const kernelAddress = await setExecution(owner, familyNFrenAlloc, nftAlloc, generalAlloc, familyNfrens, openseaAddress);

    //the nft address we wish to interact with
    const nftAddress = '0xd9b702783dc8fe89d9ff39277f9854fc5396728c';
    //The token identifier of the NFT we would like to acquire
    const tokenId = 47;
    //The chain the nft contract is deployed to
    const chain = 'sepolia';
    const openseaData = await getNftEncodedData(chain, nftAddress, tokenId, kernelAddress);

    console.log(openseaData)

    console.log("Purchasing NFT");

    //For purchasing NFTs
    await makeTransfer(kernelAddress, owner, openseaAddress, amount, openseaData);

    console.log("Making transfer");

    //For a normal transfer
    await makeTransfer('0xc50B10431746F5E6303B0572636EfF954fbf3463', owner, friendsAddress, amount2, "");

    console.log("Chukwu biko");
}

main().then(() => process.exit(0));
