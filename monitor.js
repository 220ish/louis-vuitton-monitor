const { WebhookClient, MessageEmbed } = require('discord.js')
const { default: got } = require('got/dist/source')
const { Product, SKUs } = require('./product')

const webhook = new WebhookClient('786117237186625547', '715fyQckQ_qNcR9oiUJuZkk3VX9YMeZfrAJ7p0nw_j1falcKuZxV9Kp14Wl8Eeq4AJW0')

setInterval(() => {
    got.get('https://api.louisvuitton.com/api/deu-de/catalog/availability/' + Product.id, {
        http2: true,
        resolveBodyOnly: true,
        responseType: 'json',
        headers: { 'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Safari/605.1.15' }
    })
    .then(response => {
        console.log(`${new Date().toLocaleTimeString()} - LV Monitor - ${Product.title} - Monitoring for restocks`)
        let styles = response.skuAvailability
        for (i in styles){
            let style = SKUs.find(_ => _.id == styles[i].skuId)
            if (style) {
                styles[i].color = style.color, styles[i].size = style.size
                if (styles[i].instock && !style.instock){
                    let embed = new MessageEmbed()
                        .addField('Size', styles[i].size)
                        .addField('Color', styles[i].color)
                        .setAuthor('Louis Vuitton Monitor')
                        .setThumbnail(Product.img)
                        .setTitle(Product.title)
                        .setURL(Product.url)
                        .setTimestamp()
                        
                    webhook.send(embed)
                    webhook.send('<@everyone>')
                    style.instock = true
                }
            }
        }
    })
    .catch(error => {
        throw new Error('An error has occured, your IP might be banned: ' + error)
    })
}, 10000);