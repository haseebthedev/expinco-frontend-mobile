import React, { useEffect, useState } from "react"
import { View, FlatList, ActivityIndicator } from "react-native"
import { Text } from "app/components/Text/Text"
import { Button } from "app/components/Buttons/Button/Button"
import { colors } from "app/theme"
import { ModalHoc } from "app/components/HOC/ModalScreen/ModalScreen"
import { TxKeyPath } from "app/i18n"
import { ListItemCard } from "app/components/Cards/ListItemCard/ListItemCard"
import { getCategoryList } from "app/store/slices/categoy/categoryService"
import { TransactionCategoryI } from "app/interfaces"
import { RootState, useAppDispatch, useAppSelector } from "app/store/store"
import styles from "./styles"

interface Props {
  selectedItem?: TransactionCategoryI
  isVisible: boolean
  title: string
  titleTx?: TxKeyPath
  onPressClose?: () => void
  onPressDone?: (data: any) => void
}

export const CategoryModal = ({
  selectedItem = null,
  isVisible = false,
  title,
  titleTx,
  onPressClose,
  onPressDone,
}: Props) => {
  const dispatch = useAppDispatch()

  const [showDoneBtn, setShowDoneBtn] = useState<boolean>(false)
  const { categories, loading: categoryLoading } = useAppSelector(
    (state: RootState) => state.category,
  )

  const [state, setState] = useState({
    list: [],
    page: 1,
    hasNext: false,
    listRefreshing: false,
  })

  // Function that selects/unselects a category
  const toggleSelected = (id: string) => {
    let newItems = state.list.map((el) => {
      if (el._id === id) {
        el.selected = !el.selected
        return el
      } else {
        el.selected = false
        return el
      }
    })
    setState((prev) => ({
      ...prev,
      list: newItems,
    }))

    // Checking if 3 or more items have selected = true, then set showDoneBtn = true
    let shouldShowDone = newItems.filter((el) => el.selected)
    if (shouldShowDone.length) {
      setShowDoneBtn(true)
    } else {
      setShowDoneBtn(false)
    }
  }

  const _doneHandler = () => {
    let itemSelected = state.list.filter((el) => el.selected)
    onPressDone(itemSelected)
  }

  const getCategoriesFromServer = async () => {
    dispatch(getCategoryList())

    let nList = categories?.data.map((el) => {
      if (el._id === selectedItem?._id) {
        return {
          ...el,
          selected: true,
        }
      } else {
        return {
          ...el,
          selected: false,
        }
      }
    })
    setState((prev) => ({
      ...prev,
      list: nList,
      page: 1 + state.page,
      hasNext: false,
    }))
  }

  useEffect(() => {
    /**
     * If modal is visible, then only we will call api and load data
     */
    if (isVisible) {
      getCategoriesFromServer()

      /**
       * This will show the done button if user selects more than 2 categories
       */
      if (selectedItem?._id) {
        setShowDoneBtn(true)
      } else {
        setShowDoneBtn(false)
      }
    }

    return () => {
      setState((prev) => ({
        ...prev,
        list: [],
        page: 1,
        hasNext: false,
        listRefreshing: false,
      }))
    }
  }, [isVisible])

  const FooterComponent = () => {
    if (!categoryLoading) {
      return <></>
    }

    return (
      <View style={{ paddingVertical: 20 }}>
        <ActivityIndicator animating size="small" color={colors.palette.primary500} />
      </View>
    )
  }

  return (
    <ModalHoc title={title} titleTx={titleTx} isVisible={isVisible} onPressClose={onPressClose}>
      <FlatList
        data={state.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <ListItemCard item={item} onPress={(_id) => toggleSelected(_id)} />
        )}
        keyExtractor={({ _id }) => _id}
        style={styles.flatlistStyles}
        contentContainerStyle={styles.containerStyle}
        ListFooterComponent={FooterComponent}
        // ListEmptyComponent={() => !isLoading && <Text text="No categories found!" />}
      />
      {showDoneBtn && (
        <Button
          tx="common.ok"
          preset="reversed"
          onPress={_doneHandler}
          style={styles.spacingBottom}
        />
      )}
    </ModalHoc>
  )
}
