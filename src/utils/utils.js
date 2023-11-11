export const padAddress = (_address) => {
    return `${_address.substring(0, 5)}...${_address.substring((_address.length - 3), _address.length)}`;
}

//addresses is in this format: 0xdBd899379844d35a1a1f5d51d3185dd821f44dc208c899379844d35a1a1f5d51d3185dd821f44dc3
//returns an array of addresses without 0x prefix
export const splitAddresses = (_addresses) => {
    const addressesWithout0x = _addresses.substring(2, _addresses.length);
    return (addressesWithout0x.match(/[\s\S]{1,40}/g));
}

//input: ['0xabc', '0xbdf', '0xdft']
//output: '0xabcbdfdft'
export const arrToBytes = (_arr) => {
    let newarr = _arr.map(a => a.substring(2, a.length))
    return `0x${newarr.join("")}`;
}