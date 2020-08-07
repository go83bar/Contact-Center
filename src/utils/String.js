
class String {

    static humanize(str) {
        return str
            .replace(/^[\s_]+|[\s_]+$/g, '')
            .replace(/[_\s]+/g, ' ')
            .replace(/(^\w{1})|(\s{1}\w{1})/g, function (m) {
                return m.toUpperCase();
            });
    }

    static formatPhoneNumber(str) {
        //Filter only numbers from the input
        let cleaned = ('' + str).replace(/\D/g, '');

        //Check if the input is of correct length
        let match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);

        if (match) {
            return '(' + match[1] + ') ' + match[2] + '-' + match[3]
        }
        return str
    }

    static truncate(str, limit) {
        var bits, i;
        bits = str.split('');
        if (bits.length > limit) {
            for (i = bits.length - 1; i > -1; --i) {
                if (i > limit) {
                    bits.length = i;
                }
                else if (' ' === bits[i]) {
                    bits.length = i;
                    break;
                }
            }
            bits.push('...');
        }
        return bits.join('');
    };

    static validatePassword(password) {
        // response object
        let output = {
            valid: false,
            lengthTest: false,
            upperCaseTest: false,
            lowerCaseTest: false,
            specialCharsTest: false,
            numbersTest: false
        };

        // must be at least 8 chars
        if (password.length > 7) {
            output.lengthTest = true
        }

        // go through each char and see if every test passes
        const specialCharacters = [33,35,36,37,38,39,40,21,42,42,44,45,46,47,58,59,60,61,62,63,91,92,93,94,95,123,124,125];
        for( let i=0;i < password.length;i++) {
            const cc = password.charCodeAt(i);
            if(cc > 47 && cc < 58) {
                output.numbersTest = true;
            }
            else if (cc > 64 && cc < 91) {
                output.upperCaseTest = true;
            }
            else if (cc > 96 && cc < 123) {
                output.lowerCaseTest = true;
            }
            else if (specialCharacters.indexOf(cc) !== -1) {
                output.specialCharsTest = true;
            }
            if(output.lengthTest &&
                output.upperCaseTest &&
                output.lowerCaseTest &&
                output.specialCharsTest &&
                output.numbersTest) {
                output.valid = true;
                return output;
            }
        }

        // if we got here, something was still false
        return output;
    }
}
export default String
