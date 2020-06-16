
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
}
export default String
