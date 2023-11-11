const { parseAbi } = require('viem');

export const executorABI = parseAbi([
    'function transfer(address _receipient, uint _amount, address _validator, bytes calldata data) external'
]);

export const kernelABI = parseAbi([
    'function setExecution(bytes4 _selector, address _executor, address _validator, uint48 _validUntil, uint48 _validAfter, bytes calldata _enableData) external payable',
]);

export const execAddress = '0x2F8D2EF350bA3259977158caB11fE57599B293eE';
export const validatorAddress = "0xdE0fb58C5714d920ba33d6F86ccEAfFC2Fe7dfc8";
export const openseaAddress = '0x00000000000000ADc04C56Bf30aC9d3c0aAF14dC';
export const validUntil = 0; // is the timestamp at which the enabledData expires. When set to 0, it never expires
export const validAfter = 0; //is the timestamp at which the enabledData becomes active. When set to 0, it's immediately active
export const selector = '0x92b4dfd2';
export const validatorABI = parseAbi([
    'function getAllocations(address _kernel) external view returns(address, address, uint256, uint256, uint256, bytes)'
]);
export const SendStates = {
    NOTSENT: "Send",
    SENDING: "Sending...",
    SENT: "Sent"
}

export const TabIds = {
    fnf: 0,
    misc: 1,
    nfts: 2
}

export const SplitStates = {
    UNSPLIT: "Split",
    SPLITTING: "Splitting wallet...",
    SPLITTED: "Wallet Splitted"
}

//:
//tuple(address,address,uint256,uint256,uint256,bytes): 
