import React, { FC, useEffect, useState } from "react"
import { Image, TextInput, TouchableOpacity, View } from "react-native"
import { hp, wp } from "app/utils/responsive"
import { colors } from "app/theme"
import { ScreensEnum } from "app/enums"
import { TransactionType } from "app/enums/transactions.enum"
import { AppStackScreenProps } from "app/navigators"
import { TransactionCategoryI } from "app/interfaces"
import { useAppDispatch } from "app/store/store"
import { getAllWallets } from "app/store/slices/wallet/walletService"
import { WalletI } from "app/store/slices/wallet/types"
import { launchImageLibrary } from "react-native-image-picker"
import { uploadImageToCloudinary } from "app/utils/uploadImage"
import { Button, Header, Text, CategoryModal, WalletModal } from "app/components"
import { updateTransaction } from "app/store/slices/transaction/transactionService"
import imagePrev from "../../../../images/no-image.jpg"
import Ionicons from "react-native-vector-icons/Ionicons"
import Icon from "react-native-vector-icons/Entypo"
import styles from "./styles"

export const EditTransactionScreen: FC<AppStackScreenProps<ScreensEnum.EDIT_TRANSACTION>> = ({
  navigation,
  route,
}) => {
  const { item } = route.params
  const dispatch = useAppDispatch()

  const [showCategoryModal, setShowCategoryModal] = useState<boolean>(false)
  const [showWalletModal, setShowWalletModal] = useState<boolean>(false)
  const [selectedCategory, setSelectedCategory] = useState<
    (TransactionCategoryI & { selected: boolean }) | any
  >({ name: item?.category?.name })
  const [selectedWallet, setSelectedWallet] = useState<(WalletI & { selected: boolean }) | any>({
    name: item?.wallet.name,
  })
  const [amount, setAmount] = useState<string>(String(item?.amount))
  const [description, setDescription] = useState<string>(item?.description)
  const [selectedAttachment, setSelectedAttachment] = useState<any>(item?.attachments)
  const [attachmentUpload, setAttachmentUpload] = useState<boolean>(false)
  const [attachments, setAttachments] = useState<any>(item?.attachments)

  const onUpdateTransactionPress = async () => {
    if (attachmentUpload) {
      // await uploadImageToCloudinary(selectedAttachment)
      const file = await uploadImageToCloudinary(selectedAttachment)
      if (file) {
        await dispatch(
          updateTransaction({
            id: item?._id,
            type: item?.type,
            amount: amount,
            category: selectedCategory._id,
            wallet: selectedWallet._id,
            description: description,
            attachments: [file._id],
          }),
        )
      }
    } else {
      await dispatch(
        updateTransaction({
          id: item?._id,
          type: item?.type,
          amount: amount,
          category: selectedCategory._id,
          wallet: selectedWallet._id,
          description: description,
          attachments: [selectedAttachment[0]._id],
        }),
      )
    }

    navigation.navigate(ScreensEnum.HOME)
  }

  const uploadAttachment = async () => {
    let result = await launchImageLibrary({
      mediaType: "photo",
    })

    if (result?.assets) {
      setSelectedAttachment(result.assets[0])
      setAttachmentUpload(true)
      setAttachments({ ...attachments, uri: result.assets[0].uri })
    }
  }

  const removeAttachment = async () => {
    setAttachmentUpload(false)
    setAttachments({ ...attachments, uri: "" })
  }

  useEffect(() => {
    dispatch(getAllWallets())
  }, [])

  return (
    <View>
      <Header
        title={item?.type === TransactionType.INCOME ? "Edit Income" : "Edit Expense"}
        leftIcon="back"
        onLeftPress={() => navigation.goBack()}
      />
      <View
        style={{
          // flex: 1,
          height: hp(100),
          backgroundColor: item?.type.match(TransactionType.INCOME)
            ? colors.palette.income
            : colors.palette.expense,
        }}
      >
        <View style={styles.underHeaderBlock}>
          <View style={styles.amountBlock}>
            <Text style={styles.subTitleText}>How much?</Text>
            <View style={styles.rowFlexStartCenter}>
              <Text style={styles.amountText}>$</Text>
              <TextInput
                value={amount}
                onChangeText={setAmount}
                style={[styles.amountText, { flex: 1 }]}
                placeholder="0"
                placeholderTextColor={colors.palette.neutral100}
                keyboardType="number-pad"
              />
            </View>
          </View>

          <View style={styles.secondHalfContainer}>
            <TouchableOpacity
              style={styles.itemContainer}
              onPress={() => setShowCategoryModal(true)}
            >
              <Text style={styles.itemTextHeading}>
                {selectedCategory?.name ? selectedCategory.name : `Select Category`}
              </Text>
              <Ionicons name="chevron-down" size={25} color="gray" />
            </TouchableOpacity>
            <View style={styles.itemContainer}>
              <TextInput
                value={description}
                placeholder="Description"
                autoCorrect={false}
                style={styles.inputFieldStyle}
                onChangeText={setDescription}
              />
            </View>

            <TouchableOpacity onPress={() => setShowWalletModal(true)} style={styles.itemContainer}>
              <Text style={styles.itemTextHeading}>
                {selectedWallet?.name ? selectedWallet.name : `Select Wallet`}
              </Text>
              <Ionicons name="chevron-down" size={25} color="gray" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.attachmentBtn} onPress={uploadAttachment}>
              {attachments.length > 0 ? (
                <>
                  <TouchableOpacity onPress={removeAttachment} style={styles.closeBtn}>
                    <Icon name="cross" size={20} color="white" />
                  </TouchableOpacity>
                  <Image
                    source={attachments[0].secureURL && { uri: attachments[0].secureURL }}
                    style={{ width: wp(13), height: hp(6), borderRadius: hp(1) }}
                  />
                </>
              ) : (
                <>
                  <Ionicons name="attach" size={25} color="gray" style={styles.spacingRight} />
                  <Text style={styles.itemTextHeading}>Add attachment</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={styles.spacingTop}>
        <Button
          text={item?.type === TransactionType.INCOME ? "Edit Income" : "Edit Expense"}
          onPress={onUpdateTransactionPress}
          preset={item?.type === TransactionType.INCOME ? "income" : "expense"}
        />
      </View>

      <CategoryModal
        isVisible={showCategoryModal}
        selectedItem={selectedCategory}
        title="Choose Category"
        onPressClose={() => setShowCategoryModal(false)}
        onPressDone={(data) => {
          setSelectedCategory(data[0])
          setShowCategoryModal(false)
        }}
      />

      <WalletModal
        isVisible={showWalletModal}
        title="Choose Wallet"
        onPressClose={() => setShowWalletModal(false)}
        onPressDone={(data) => {
          setSelectedWallet(data[0])
          setShowWalletModal(false)
        }}
      />
    </View>
  )
}
