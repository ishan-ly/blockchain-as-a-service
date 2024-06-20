import axios from 'axios'

export class NotificationService {
    private readonly from = process.env.DEFAULT_EMAIL_FROM;

    async sentNFTAirdrops(to: string, name: string, imgUrl: string, contractAddress: string, url: string) {
        await this.sendEmail(this.from, to, 'Congratulations! You have Received an NFT Airdrop 🎉', process.env.TEMPLATE_ID_NFT_AIRDROP, { name, url, imgUrl, contractAddress });
    }
    private async sendEmail(from: string, to: string, subject: string, templateId : string, values: any) {
        if (process.env.SENING_EMAIL == 'true') {
            const response = await axios.request(
                {
                    method: 'post',
                    url: `${process.env.NOTIFICATION_SERVICE_BASE_URL}/email/sendEmail`,
                    data: {from, to, subject, templateId, placeHolderMap : values},
                }
            )
            return response.status === 200;
        }
        return;
    }
}
