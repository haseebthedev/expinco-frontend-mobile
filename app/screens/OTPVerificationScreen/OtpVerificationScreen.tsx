import React, { FC, useEffect, useRef, useState } from "react"
import { ScrollView, TextInput, View, ViewStyle } from "react-native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { AppStackScreenProps } from "app/navigators"
import { Button, Header, Screen, Text } from "app/components"
import { ScreensEnum } from "app/enums"
import { RootState, useAppDispatch, useAppSelector } from "app/store/store"
import { resendOtpCode, verifyEmailService } from "app/store/slices/auth/authService"
import { VerifyEmailResponseI } from "app/store/slices/auth/types"
import styles from "./styles"
import { showMessage } from "react-native-flash-message"

interface OtpVerificationScreenProps
  extends NativeStackScreenProps<AppStackScreenProps<ScreensEnum.OTP_VERIFICATION>> {}

export const OtpVerificationScreen: FC<OtpVerificationScreenProps> = ({ navigation, route }) => {
  const dispatch = useAppDispatch()
  const { user, loading, error } = useAppSelector((state: RootState) => state.auth)

  const input1 = useRef(null)
  const input2 = useRef(null)
  const input3 = useRef(null)
  const input4 = useRef(null)
  const input5 = useRef(null)
  const input6 = useRef(null)

  const [otp, setOtp] = useState({
    1: "",
    2: "",
    3: "",
    4: "",
    5: "",
    6: "",
  })

  const MAX_OTP_TRIES: number = 10
  const OTP_TIMER: number = 30

  const [timer, setTimer] = useState<number>(OTP_TIMER)
  const [resendOtpTries, setresendOtpTries] = useState<number>(1)
  const [otpDisableBtn, setOptDisableBtn] = useState<boolean>(false)

  const _verifyOTP = async () => {
    let authCode = Object.values(otp).join("")

    await dispatch(verifyEmailService({ email: user?.user?.email, authCode: authCode }))
      .unwrap()
      .then((response: VerifyEmailResponseI) => navigation.navigate(ScreensEnum.SIGNIN as any))
      .catch((err: Error) => console.log("error", err))

    // let checkAuthCode = await authStore.verifyAuthCode(params.email, authCode)
    // authCode is valid
    // if (checkAuthCode) {
    //   if (params.prevScreen) {
    //     if (params.prevScreen === ScreenEnum.SIGNUP) {
    //       // USER SIGNUP
    //       authStore.emailVerification(params?.email, authCode)
    //     } else if (params.prevScreen === ScreenEnum.FORGOT_PASSWORD) {
    //       // FORGOT PASSWORD
    //       navigation.navigate(ScreenEnum.NEW_PASSWORD, {
    //         prevScreen: ScreenEnum.OTP_VERIFICATION,
    //         authCode,
    //         email: params?.email,
    //       })
    //     }
    //   }
    // } else {
    // showMessage({
    //   icon: "info",
    //   type: "warning",
    //   message: "Entered code is invalid!",
    // })
    // }
  }

  const resendOTPHandler = async () => {
    if (resendOtpTries < MAX_OTP_TRIES) {
      setOtp({
        1: "",
        2: "",
        3: "",
        4: "",
        5: "",
        6: "",
      })
      dispatch(resendOtpCode({ email: user?.user?.email }))
      setresendOtpTries((prev) => prev + 1)
      setTimer(OTP_TIMER)
    } else {
      showMessage({
        icon: "warning",
        type: "warning",
        message: "Resend OTP has reached max limit. Try later!",
      })
      setOptDisableBtn(true)
    }
  }

  useEffect(() => {
    let counter: NodeJS.Timer
    if (timer === 0) {
      clearInterval(counter)
      setOptDisableBtn(true)
    } else {
      counter = setInterval(() => setTimer((prev) => prev - 1), 1000)
      setOptDisableBtn(false)
    }
    return () => clearInterval(counter)
  }, [timer])

  return (
    <Screen style={styles.container}>
      <Header
        titleTx="common.verification"
        leftIcon="back"
        onLeftPress={() => navigation.navigate(ScreensEnum.SIGNIN as any)}
      />

      <ScrollView style={{ paddingHorizontal: 20 }}>
        <Text style={styles.infoText} tx="otpVerificationScreen.sendOtpCode" />
        <Text style={styles.subtitleText} tx="otpVerificationScreen.otp" />
        <View style={styles.otpForm}>
          <TextInput
            ref={input1}
            value={otp["1"]}
            keyboardType="number-pad"
            maxLength={1}
            style={styles.codeVerifyBlock}
            selectTextOnFocus
            onFocus={() => input1.current.focus()}
            onChangeText={(text) => {
              setOtp({ ...otp, 1: text })
              text && input2.current.focus()
            }}
          />
          <TextInput
            ref={input2}
            value={otp["2"]}
            keyboardType="number-pad"
            maxLength={1}
            style={styles.codeVerifyBlock}
            selectTextOnFocus
            onFocus={() => input2.current.focus()}
            onChangeText={(text) => {
              setOtp({ ...otp, 2: text })
              text ? input3.current.focus() : input1.current.focus()
            }}
            onKeyPress={({ nativeEvent }) => {
              if (nativeEvent.key === "Backspace") {
                input1.current.clear()
                input1.current.focus()
              }
            }}
          />
          <TextInput
            ref={input3}
            value={otp["3"]}
            maxLength={1}
            keyboardType="number-pad"
            style={styles.codeVerifyBlock}
            selectTextOnFocus
            onFocus={() => input3.current.focus()}
            onChangeText={(text) => {
              setOtp({ ...otp, 3: text })
              text ? input4.current.focus() : input2.current.focus()
            }}
            onKeyPress={({ nativeEvent }) => {
              if (nativeEvent.key === "Backspace") {
                input2.current.clear()
                input2.current.focus()
              }
            }}
          />
          <TextInput
            ref={input4}
            value={otp["4"]}
            maxLength={1}
            style={styles.codeVerifyBlock}
            keyboardType="number-pad"
            selectTextOnFocus
            onFocus={() => input4.current.focus()}
            onChangeText={(text) => {
              setOtp({ ...otp, 4: text })
              text ? input5.current.focus() : input3.current.focus()
            }}
            onKeyPress={({ nativeEvent }) => {
              if (nativeEvent.key === "Backspace") {
                input3.current.clear()
                input3.current.focus()
              }
            }}
          />
          <TextInput
            ref={input5}
            value={otp["5"]}
            maxLength={1}
            style={styles.codeVerifyBlock}
            keyboardType="number-pad"
            selectTextOnFocus
            onFocus={() => input5.current.focus()}
            onChangeText={(text) => {
              setOtp({ ...otp, 5: text })
              text ? input6.current.focus() : input4.current.focus()
            }}
            onKeyPress={({ nativeEvent }) => {
              if (nativeEvent.key === "Backspace") {
                input4.current.clear()
                input4.current.focus()
              }
            }}
          />
          <TextInput
            ref={input6}
            value={otp["6"]}
            maxLength={1}
            style={styles.codeVerifyBlock}
            keyboardType="number-pad"
            selectTextOnFocus
            onFocus={() => input6.current.focus()}
            onChangeText={(text) => {
              setOtp({ ...otp, 6: text })
              !text ? input5.current.focus() : input6.current.blur()
            }}
            onKeyPress={({ nativeEvent }) => {
              if (nativeEvent.key === "Backspace") {
                input5.current.clear()
                input5.current.focus()
              }
            }}
          />
        </View>
        <View style={styles.codeExpireText}>
          <Text tx="otpVerificationScreen.codeExpiresIn" style={styles.spacingTop} />
          <Text text={"00 : " + timer} style={styles.timerText} />
        </View>

        <Button tx="common.verify" preset="filled" onPress={_verifyOTP} style={styles.verifyBtn} />
        <Button
          tx="common.resend"
          preset="filled"
          onPress={resendOTPHandler}
          style={styles.resendCodeBtn}
          disabled={!otpDisableBtn}
        />
      </ScrollView>
    </Screen>
  )
}

const $root: ViewStyle = {
  flex: 1,
}
