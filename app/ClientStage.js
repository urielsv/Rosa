class ClientStage {
    constructor(flags) {
        this.flags = flags || {};
    }

    setFlags(flags) {
        this.flags = flags;
    }

    getFlags() {
        return this.flags;
    }
}
module.exports = ClientStage;