const convertName = (name) => {
    return name.replaceAll('_', ' ');
}

const splitAndConvertName = (name) => {
    return name.split('/')[3].replaceAll('_', ' ');
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