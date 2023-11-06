import { 
    Flex,
    ButtonGroup,
    IconButton,
    useEditableControls
} from '@chakra-ui/react'
import { 
    CheckIcon,
    CloseIcon,
    EditIcon
} from '@chakra-ui/icons'

function EditableControls() {
    const {
      isEditing,
      getSubmitButtonProps,
      getCancelButtonProps,
      getEditButtonProps,
    } = useEditableControls()

    return isEditing ? (
      <ButtonGroup justifyContent='center' size='sm' ml={2}>
        <IconButton aria-label='save' icon={<CheckIcon />} {...getSubmitButtonProps()} />
        <IconButton aria-label='cancel' icon={<CloseIcon />} {...getCancelButtonProps()} />
      </ButtonGroup>
    ) : (
      <Flex justifyContent='center'>
        <IconButton aria-label='edit' colorScheme='teal' size='sm' ml={2} icon={<EditIcon />} {...getEditButtonProps()} />
      </Flex>
    )
  }

export default EditableControls;