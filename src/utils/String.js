
class String {

    static humanize(str) {
        return str
            .replace(/^[\s_]+|[\s_]+$/g, '')
            .replace(/[_\s]+/g, ' ')
            .replace(/(^\w{1})|(\s{1}\w{1})/g, function (m) {
                return m.toUpperCase();
            });
    }
}
export default String
