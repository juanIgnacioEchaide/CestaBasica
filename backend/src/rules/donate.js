import { Donation, Voucher } from '../repositories'
import AWS from 'aws-sdk'

export async function donate ({
  login,
  donationId,
  voucherId,
  leaderLogin,
  lat,
  lon,
  delivered,
  receivedCpf,
  receivedName,
  donateDonationFile
}) {

  if (!donationId) {
    throw new Error('donationId is required')
  }

  if (!voucherId) {
    throw new Error('voucherId is required')
  }

  if (!leaderLogin) {
    throw new Error('leaderLogin is required')
  }

  if (!lat) {
    throw new Error('lat is required')
  }

  if (!lon) {
    throw new Error('lon is required')
  }

  // console.log(arguments)

  if (delivered === undefined) {
    throw new Error('delivered is required')
  }

  // convertendo 'true' ou 'false' ou true ou false pra boolean
  delivered = JSON.parse(delivered)

  if (delivered === false) {
    const voucher = await Voucher.findOne({ voucherId })

    voucher.status = 3
    voucher.delivered = new Date()
    voucher.point = {
      type: 'Point',
      coordinates: [lon, lat]
    }
    voucher.save()
    return
  } else if (delivered !== true) {
    // todo: implement joi validation
    throw new Error('delivered must be a boolean value')
  }

  if (!receivedCpf) {
    throw new Error('receivedCpf is required')
  }

  if (!receivedName) {
    throw new Error('receivedName is required')
  }

  if (!donateDonationFile) {
    throw new Error('donateDonationFile is required')
  }

  const donation = await Donation.findOne({ donationId: donationId })

  if (!donation) {
    throw new Error(`Could not find the Donation with id: ${donationId}`)
  }

  if (donation) {
    const timestamp = new Date()
    const [, ext] = donateDonationFile.mimetype.split('/')
    const key = `provas/entregas/entrega-doacao-${login}-${donationId}-${timestamp.toISOString()}.${ext}`

    const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: key,
      Body: donateDonationFile.data
    }

    const s3 = new AWS.S3()

    s3.upload(params, function (err, data) {
      if (err) {
        throw err
      }
      console.log(`File uploaded successfully.Key:${key}`)
    })

    const voucher = await Voucher.findOne({ voucherId })

    if (!voucher) {
      throw new Error(`Could not find the voucherId provided: ${voucherId}`)
    }

    console.log(receivedCpf, receivedName)

    voucher.receivedCpf = receivedCpf
    voucher.status = 2
    voucher.receivedName = receivedName
    voucher.delivered = timestamp
    voucher.cardDonatedS3Key = key
    voucher.point = {
      type: 'Point',
      coordinates: [lon, lat]
    }

    console.log(voucher)

    donation.quantity--

    if (donation.quantity < 0) {
      throw new Error('The quantity specified isn\'t available')
    } else if (donation.quantity === 0) {
      donation.status = 4
      donation.completed = timestamp
      donation.quantity = 0
    } else {
      donation.status = 3
      donation.lastDelivery = timestamp
    }

    await voucher.save()
    await donation.save()

    return donation
  }

  return Promise.reject(new Error(`Donating donation ${donationId} failed.`))
}
