const { onRequest } = require("firebase-functions/v2/https");
const next = require("next");

const nextjsDistDir = "../.next";

const nextjsApp = next({
    dev: false,
    conf: {
        distDir: nextjsDistDir,
    },
});

const nextjsHandle = nextjsApp.getRequestHandler();

exports.nextServer = onRequest(
    {
        region: "southamerica-east1",
        memory: "512MiB",
        timeoutSeconds: 60,
    },
    async (req, res) => {
        await nextjsApp.prepare();
        return nextjsHandle(req, res);
    }
);
