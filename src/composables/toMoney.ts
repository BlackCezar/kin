export default function toMoney(val: number) {
    const intl = new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        maximumFractionDigits: 0
    })

    return intl.format(val / 100)
}