/* eslint-disable new-cap */

// @flow

function strMapToObj(strMap) {
    const obj = Object.create(null);

    for (const [ k, v ] of strMap) {
        // We don’t escape the key '__proto__'
        // which can cause problems on older engines
        if (v instanceof Map) {
            obj[k] = strMapToObj(v);
        } else if (v instanceof Array) {
            obj[k] = [ ...v ];
        } else {
            obj[k] = v;
        }
    }

    return obj;
}

export function buttplugDeviceToObject(device) {
    const obj = {
        index: device.index,
        name: device.name,
        allowedMsgs: strMapToObj(device.allowedMsgs)
    };

    return obj;
}
