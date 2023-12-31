import i18n from "i18n-js"
import React from "react"
import { colors, typography } from "app/theme"
import { TxKeyPath, isRTL, translate } from "app/i18n"
import { StyleProp, Text as RNText, TextProps as RNTextProps, TextStyle } from "react-native"

type Sizes = keyof typeof $sizeStyles
type Weights = keyof typeof typography.primary
type Presets = keyof typeof $presets

export interface TextProps extends RNTextProps {
  tx?: TxKeyPath
  text?: string
  txOptions?: i18n.TranslateOptions
  style?: StyleProp<TextStyle>
  preset?: Presets
  weight?: Weights
  size?: Sizes
  children?: React.ReactNode
}

export function Text(props: TextProps) {
  const { weight, size, tx, txOptions, text, children, style: $styleOverride, ...rest } = props

  const i18nText = tx && translate(tx, txOptions)
  const content = i18nText || text || children

  const preset: Presets = $presets[props.preset] ? props.preset : "default"
  const $styles = [
    $rtlStyle,
    $presets[preset],
    $fontWeightStyles[weight],
    $sizeStyles[size],
    $styleOverride,
  ]

  return (
    <RNText {...rest} style={$styles}>
      {content}
    </RNText>
  )
}

const $sizeStyles = {
  xxl: { fontSize: 36, lineHeight: 44 } satisfies TextStyle,
  xl: { fontSize: 24, lineHeight: 34 } satisfies TextStyle,
  lg: { fontSize: 20, lineHeight: 32 } satisfies TextStyle,
  md: { fontSize: 16, lineHeight: 26 } satisfies TextStyle,
  sm: { fontSize: 14, lineHeight: 24 } satisfies TextStyle,
  xs: { fontSize: 12, lineHeight: 21 } satisfies TextStyle,
  xxs: { fontSize: 10, lineHeight: 18 } satisfies TextStyle,
  xxxs: { fontSize: 8, lineHeight: 18 } satisfies TextStyle,
}

const $fontWeightStyles = Object.entries(typography.primary).reduce((acc, [weight, fontFamily]) => {
  return { ...acc, [weight]: { fontFamily } }
}, {}) as Record<Weights, TextStyle>

const $baseStyle: StyleProp<TextStyle> = [
  $sizeStyles.sm,
  $fontWeightStyles.normal,
  { color: colors.text },
]

const $presets = {
  default: $baseStyle,

  bold: [$baseStyle, $fontWeightStyles.bold] as StyleProp<TextStyle>,

  title: [$baseStyle, $fontWeightStyles.bold, $sizeStyles.md] as StyleProp<TextStyle>,

  heading: [$baseStyle, $sizeStyles.xxl, $fontWeightStyles.bold] as StyleProp<TextStyle>,

  subheading: [$baseStyle, $sizeStyles.md, $fontWeightStyles.semiBold] as StyleProp<TextStyle>,

  headerText: [$baseStyle, $sizeStyles.xl, $fontWeightStyles.bold] as StyleProp<TextStyle>,

  largeHeading: [$baseStyle, $sizeStyles.lg, $fontWeightStyles.semiBold] as StyleProp<TextStyle>,

  formLabel: [
    $baseStyle,
    $sizeStyles.xxs,
    $fontWeightStyles.medium,
    { color: colors.textDim },
  ] as StyleProp<TextStyle>,

  formHelper: [$baseStyle, $sizeStyles.xxs, $fontWeightStyles.normal] as StyleProp<TextStyle>,

  pageHeading: [
    $baseStyle,
    $sizeStyles.md,
    $fontWeightStyles.semiBold,
    { color: colors.textDim },
  ] as StyleProp<TextStyle>,

  description: [$baseStyle, $sizeStyles.md, $fontWeightStyles.medium] as StyleProp<TextStyle>,
}

const $rtlStyle: TextStyle = isRTL ? { writingDirection: "rtl" } : {}
