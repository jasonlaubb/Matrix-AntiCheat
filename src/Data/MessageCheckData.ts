export default {
    regExp: {
        link: {
            contents: /((http:\/\/|https:\/\/|www\.|download\.)([a-z]+\.)+[a-z]{2,8}(\/[\S]+)*\/*)|discord(\.gg|\.com\/invite)\/[\S]{1,}/gi,
            endline: / +/g,
        },
        email: {
            contents: /.$/gim,
            endline: /[\s|^(a-z|@|\.|0-9)]+/gi,
        },
    },
};
