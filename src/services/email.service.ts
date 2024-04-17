const nodemailer = require('nodemailer');
const fs = require('fs');
const ejs = require('ejs');

export class EmailService {
    private readonly host;
    private readonly port;
    private readonly username;
    private readonly password;
    private readonly from = process.env.DEFAULT_EMAIL_FROM;
    private transporter: any = null;

    constructor() {
        this.host = process.env.SMTP_HOST;
        this.port = process.env.SMTP_PORT;
        this.username = process.env.SMTP_USERNAME;
        this.password = process.env.SMTP_PASSWORD;

        if (!this.host || !this.password || !this.username || !this.port) { throw new Error('SMTP credentials are not defined.'); }

        this.transporter = nodemailer.createTransport({
            host: this.host,
            port: this.port,
            auth: {
                user: this.username,
                pass: this.password
            }
        });

    }

    async ApprovedPointsEarnedContract(to: string, name: string, url: string) {
        await this.sendEmail('./src/templates/emails/points-earned-contract-approved.ejs', this.from, to, 'Contratulations! Your points earn contract is approved', { name, url }, this.transporter);
    }

    async RejectedPointsEarnedContract(to: string, name: string, url: string) {
        await this.sendEmail('./src/templates/emails/points-earned-contract-rejected.ejs', this.from, to, 'Your points earn contract is rejected', { name, url }, this.transporter);
    }

    async sendInvoice(to: string, name: string, invoiceNumber: string, totalPrice: number, currency: string, url: string) {
        await this.sendEmail('./src/templates/emails/send-invoice.ejs', this.from, to, 'Loyyal Partnerhub Invoice Available', { name, invoiceNumber, totalPrice, currency, url }, this.transporter);
    }

    async sentNFTAirdrops(to: string, name: string, imgUrl: string, contractAddress: string, url: string) {
        await this.sendEmail('./src/templates/emails/nft-airdrop.ejs', 'freenft@loyyal.net', to, 'Congratulations! You have Received an NFT Airdrop 🎉', { name, url, imgUrl, contractAddress }, this.transporter);
    }

    private async sendEmail(templatePath: string, from: string, to: string, subject: string, values: any, transporter: any): Promise<void> {
        if (process.env.SENING_EMAIL == 'true') {
            fs.readFile(templatePath, 'utf8', async function (err, data) {
                if (err) { return console.log(err); }

                var mainOptions = {
                    from: `Loyyal Holdings <${from}>`,
                    to: to,
                    subject: subject,
                    html: ejs.render(data, { values: values })
                }

                await transporter.sendMail(mainOptions);
            });
        }
        return;
    }
}