const convertName = (name) => {
    return name.replaceAll('_', ' ');
}

const splitAndConvertName = (name) => {
    let split_data = name.split('/');
    if (split_data.length>1){
        return split_data[split_data.length-1].replaceAll('_', ' ');
    }
    else {
        return name
    }
}

const showCertainAmountOfCharacters = (name) => {
    let length = 10;
    if(name.length <= 10){
        return name
    }
    let trimmedString = name.substring(0, length);
    return trimmedString + '...';
}

export { convertName, splitAndConvertName, showCertainAmountOfCharacters };