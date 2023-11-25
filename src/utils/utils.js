export const padAddress = (_address) => {
    return `${_address.substring(0, 5)}...${_address.substring((_address.length - 3), _address.length)}`;
}

//addresses is in this format: 0xdBd899379844d35a1a1f5d51d3185dd821f44dc208c899379844d35a1a1f5d51d3185dd821f44dc3
//returns an array of addresses without 0x prefix
export const splitAddresses = (_addresses) => {
    const addressesWithout0x = _addresses.substring(2, _addresses.length);
    return (addressesWithout0x.match(/[\s\S]{1,40}/g));
}

//addresses is in this format: 0xdBd899379844d35a1a1f5d51d3185dd821f44dc208c899379844d35a1a1f5d51d3185dd821f44dc3
//returns an array of addresses with 0x prefix
export const splitAddressesWith0x = (_addresses) => {
    const addressesWithout0x = _addresses.substring(2, _addresses.length);

    // Split the hex string into 20-byte chunks
    const chunks = addressesWithout0x.match(/.{1,40}/g);

    // Add '0x' prefix to each chunk
    const resultArray = chunks?.map(chunk => '0x' + chunk);

    return resultArray;
}

//input: ['0xabc', '0xbdf', '0xdft']
//output: '0xabcbdfdft'
export const arrToBytes = (_arr) => {
    let newarr = _arr.map(a => a.substring(2, a.length))
    return `0x${newarr.join("")}`;
}

//Given 0.000333
//returns 3
//Returns the number of zeros after the decimal point and just before a non-zero number
const calculateNonZeroDecimalPlaces = (number) => {
    let decimalPlaces = 0;

    // Convert the number to a string
    let numberString = number.toString();

    // Iterate through the string to find the first non-zero decimal
    for (let i = numberString.indexOf('.') + 1; i < numberString.length; i++) {
        if (numberString[i] !== '0') {
            break;
        }
        decimalPlaces++;
    }

    return decimalPlaces;
}
//Input 0.1, 1.33
//Output 0.033, 0.44
//Divides a number by 3 and returns the output in 2decimal places.
//if there is zero before the numbers e.g 0.00233, 
//it will include the zeros and pad two non-zero numbers after the zeros. In this case the output would be 0.0023
export const divideWithNonZeroPrecision = (dividend) => {
    let result = dividend / 3;
    let m = calculateNonZeroDecimalPlaces(result);
    m = m == 0 ? 2 : m + 2;

    let rounded = result.toString().replace(new RegExp('(\\.\\d{' + m + '})\\d*'), '$1');

    return rounded;
}


export const encodeCardObject = ({ ownerAddress, openseaAddress, familyNFrenAlloc, nftAlloc, generalAlloc, familyNfrens }) => {
    let packedFnf = '';
    for (let fnf of familyNfrens) {
        packedFnf += fnf.substring(2);
    }
    const encodedData = ownerAddress + openseaAddress.substring(2) + familyNFrenAlloc + nftAlloc + generalAlloc + packedFnf;
    return encodedData;
}



