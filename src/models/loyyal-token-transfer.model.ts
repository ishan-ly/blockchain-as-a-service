export class LoyyalTokenTransfer {
    private from : string;
    private to : string;
    private amount : string;
    private identifier : string;
    private network : string;
    private txHash : string;

    constructor(obj?){
        if(obj) {
            this.from  = obj.from;
            this.to = obj.to;
            this.amount = obj.amount;
            this.identifier = obj.identifier;
            this.network = obj.network;
            this.txHash = obj.txHash
        }
    }

    public get $from(): string {
        return this.from;
    }

    public set $from(value: string) {
        this.from = value;
    }

    public get $to(): string {
        return this.to;
    }

    public set $to(to: string) {
        this.to = to;
    }

    public get $amount(): string {
        return this.amount;
    }

    public set $amount(amount: string){
        this.amount = amount;
    }

    public get $identifier(): string {
        return this.identifier;
    }

    public set $identifier(identifier: string){
        this.identifier = identifier;
    }

    public get $network(): string {
        return this.network;
    }

    public set $network(network: string){
        this.network = network;
    }

    public get $txHash(): string {
        return this.txHash;
    }

    public set $txHash(txHash: string){
        this.txHash = txHash;
    }    
}