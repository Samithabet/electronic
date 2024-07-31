type SimpleFilterObject = {
    [key: string]: string | number | boolean | { select: { [key: string]: boolean } };
};

function convertTopLevelStringBooleans(filters: SimpleFilterObject): SimpleFilterObject {
    const result: SimpleFilterObject = {};
    for (const [key, value] of Object.entries(filters)) {
        if (typeof value === 'string') {
            // Check if the string is 'true' or 'false' and convert accordingly
            if (value.toLowerCase() === 'true') {
                result[key] = true;
            } else if (value.toLowerCase() === 'false') {
                result[key] = false;
            } else {
                // Retain other strings as they are
                result[key] = value;
            }
        } else if (typeof value === 'object') {
            const selectValue: string = value['select'] as unknown as string;
            const splitArray: string[] = selectValue.split('-');
            let select: any = {};
            for (let i in splitArray) {
                select[`${splitArray[i]}`] = true;
            }
            result[key] = { select: select };
        } 
    }
    return result;
}

// Export the function
export default convertTopLevelStringBooleans;