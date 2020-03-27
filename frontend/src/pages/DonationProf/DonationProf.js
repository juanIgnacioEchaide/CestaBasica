import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom'
import { connect } from '../../store'
import { Title } from '../../components/Title'
import { LogoBack } from '../../components/Logo'
import { Input, inputTypes } from '../../components/Input'
import { File, FileTypes } from '../../components/File'
import { Legend, LegendTypes } from '../../components/Legend'
import { Paragraph, ParagraphTypes } from '../../components/Paragraph'
import { SubTitle, SubTitleTypes } from '../../components/SubTitle'
import { Button, ButtonTypes } from '../../components/Button'
import { ButtonIcon } from '../../components/ButtonIcon'

import { Loader } from '../../components/Loader'

import { Upload } from '../../services/API/upload'

import './DonationProf.scss'

import {
  confirm,
  back,
  titleDonationProf,
  legendInputAmountDonation,
  legendPicDonation,
  legendInputAddPic,
} from '../../utils/strings'

function DonationPage({ store, dispatch }) {
  const { goBack } = useHistory()
  const [numberDonation, setNumberDonation] = useState('')
  const [image, setImage] = useState('')

  const [loading, setLoading] = useState(false)

  const handleImageFile = event => {
    setImage(event.target.files[0])
  }

  const handleClickButton = async () => {
    setLoading(true)



    await Upload({ donationId: 1, file: image })
    setLoading(false)
  }
  return (
    <div className="container-donation-prof">
      {loading && <Loader />}
      <div className="sidebar-donation-prof">
        <ButtonIcon handleClick={goBack}>
          <LogoBack height={'10'} />
        </ButtonIcon>
        <Legend type={LegendTypes.STRONG} message={back} />
      </div>

      <div className="header-donation-prof">
        <Title message={`${titleDonationProf}`} />
        <Paragraph size={ParagraphTypes.LIGHT} content="descriptionDonationProf" />
        <Input
          ignoreValidate
          inputType={inputTypes.NUMBER}
          size={inputTypes.SIZE_LARGE}
          handleOnChange={setNumberDonation}
          value={numberDonation}
          placeholder={legendInputAmountDonation}
        />
      </div>

      <div className="main-donation-prof">
        <SubTitle type={SubTitleTypes.MEDIUM} width={SubTitleTypes.SIZE_SMALL} message={legendPicDonation} />
        <File file={image} handleImage={handleImageFile} placeholder={legendInputAddPic} />
      </div>

      <div className="footer-donation-prof">
        <Button handleClick={handleClickButton} disable={!image || !numberDonation.length} size={ButtonTypes.LARGE} message={confirm} />
      </div>
    </div>
  )
}
DonationPage.propTypes = {
  store: PropTypes.shape({
    donation: PropTypes.shape({
      received: PropTypes.shape({
        date: PropTypes.string,
        amount: PropTypes.number,
      }).isRequired,
    }).isRequired,
  }).isRequired,
  dispatch: PropTypes.func.isRequired,
}

export default connect(DonationPage)
