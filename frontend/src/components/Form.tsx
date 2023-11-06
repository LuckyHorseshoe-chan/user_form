import { ChangeEvent, useState, useRef } from 'react';
import { useForm } from 'react-hook-form'
import { AddIcon, DeleteIcon } from '@chakra-ui/icons'
import {
  FormErrorMessage,
  FormLabel,
  FormControl,
  Input,
  Button,
  Text,
  Box,
  Center,
  Flex,
  Spacer,
  EditableInput,
  Editable,
  EditableTextarea,
  EditablePreview,
  IconButton
} from '@chakra-ui/react'
import MapComponent from './MapComponent'
import { useAppDispatch, useAppSelector } from '../hooks';
import { 
    selectForm, setFirstName, setLastName, 
    setPatronymic, setEmail, setPhone, addField, 
    removeField, setExtraFieldName, setExtraFieldValue
} from '../features/formSlice';
import EditableControls from './EditableControls';

type FormData = {
    firstName: string
    lastName: string
    patronymic: string
    email: string
    phone: string
    address: string
}

function Form(){
    const {
        register,
        formState: { errors, isSubmitting },
    } = useForm<FormData>()

    const [fileList, setFileList] = useState<File[]>([]);
    const [fileMessage, setFileMessage] = useState('')
    const [_size, setSize] = useState(0)
    const [strSize, setStrSize] = useState('0 KB')
    const [fileNames, setFileNames] = useState<string[]>([])
    const fileInputRef = useRef<HTMLInputElement>(null);

    const form = useAppSelector(selectForm)
    const dispatch = useAppDispatch()
    
    // const files = fileList ? Array.from(fileList) : [];
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) {
            return;
        }
        setFileMessage('')
        const names = []
        const files = [...fileList, ...Array.from(e.target.files)]
        const validFiles = [] 
        var totalBytes = 0;
        for (let i = 0; i < files.length; i++){
            if (files[i].type === 'application/pdf') {
                validFiles.push(files[i])
                names.push(files[i].name)
                totalBytes += files[i].size
            }
            else setFileMessage('Некорректный формат, принимаются только файлы PDF')
        }
        if (totalBytes/1000000 > 5) setFileMessage("Суммарный объём не должен превышать 5 МБ")
        else { 
            setSize(totalBytes/1000000)
            setStrSize(_size.toPrecision(3) + ' MB'); 
            setFileList(validFiles) 
            setFileNames(names)
        };
    };

    const chooseFile = () => {
        if(fileInputRef.current) {fileInputRef.current.click()}
    }


    const handleUploadClick = () => {
        if (!fileList.length) {
            return;
        }

        // 👇 Create new FormData object and append files
        const data = new FormData();
        fileList.forEach((file: File, i: number) => {
            data.append(`file-${i}`, file, file.name);
        });

        // 👇 Uploading the files using the fetch API to the server
        // fetch('https://httpbin.org/post', {
        //   method: 'POST',
        //   body: data,
        // })
        //   .then((res) => res.json())
        //   .then((data) => console.log(data))
        //   .catch((err) => console.error(err));
    };

    function onSubmit(e: React.MouseEvent<HTMLButtonElement>) {
        console.log(form)
      }

    return(
        <Center>
            <Box w='50vw' mt={10}>
                <form>
                    <FormControl>
                        <FormLabel htmlFor='lastName'>Фамилия</FormLabel>
                        <Input
                            id='lastName'
                            {...register('lastName', {
                                required: 'Это обязательное поле!',
                                pattern: {value: /^[А-ЯЁ][а-яё]+$/, message: 'Некорректные данные'}
                            })}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => dispatch(setLastName(e.target.value))}
                            isInvalid={errors.lastName ? true : false}
                        />
                        <Text color='red'>
                            {errors.lastName?.message}
                        </Text>
                        <FormLabel htmlFor='firstName'>Имя</FormLabel>
                        <Input
                            id='firstName'
                            {...register('firstName', {
                                required: 'Это обязательное поле!',
                                pattern: {value: /^[А-ЯЁ][а-яё]+$/, message: 'Некорректные данные'}
                            })}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => dispatch(setFirstName(e.target.value))}
                            isInvalid={errors.firstName ? true : false}
                        />
                        <Text color='red'>
                            {errors.firstName?.message}
                        </Text>
                        <FormLabel htmlFor='patronymic'>Отчество</FormLabel>
                        <Input
                            id='patronymic'
                            {...register('patronymic', {
                                required: false,
                                pattern: {value: /^[А-ЯЁ][а-яё]+$/, message: 'Некорректные данные'}
                            })}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => dispatch(setPatronymic(e.target.value))}
                            isInvalid={errors.patronymic ? true : false}
                        />
                        <Text color='red'>
                            {errors.patronymic?.message}
                        </Text>
                        <FormLabel htmlFor='email'>Email</FormLabel>
                        <Input
                            id='email'
                            {...register('email', {
                                required: 'Это обязательное поле!',
                                pattern: {value: /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/, message: 'Некорректные данные'}
                            })}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => dispatch(setEmail(e.target.value))}
                            isInvalid={errors.email ? true : false}
                        />
                        <Text color='red'>
                            {errors.email?.message}
                        </Text>
                        <FormLabel htmlFor='phone'>Телефон</FormLabel>
                        <Input
                            id='phone'
                            placeholder="+7 (999) 999-99-99"
                            {...register('phone', {
                                required: 'Это обязательное поле!',
                                pattern: {value: /\+7\(\d{3}\)\d{3}-\d{2}-\d{2}/, message: 'Некорректные данные'}
                            })}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => dispatch(setPhone(e.target.value))}
                            isInvalid={errors.phone ? true : false}
                        />
                        <Text color='red'>
                            {errors.phone?.message}
                        </Text>
                        <FormLabel htmlFor='address'>Адрес</FormLabel>
                        <Input
                            id='address'
                            value={form[5].value}
                            {...register('address', {
                                required: 'Это обязательное поле!',
                            })}
                            isDisabled
                        />
                        <MapComponent/>
                        <FormLabel>Загрузка файлов</FormLabel>
                        <Flex>
                            <Button onClick={chooseFile}>
                                Choose file
                            </Button>
                            <Center>
                                <Text ml={2}>{strSize}</Text>
                            </Center>
                            <Spacer/>
                        </Flex>
                        <Flex>
                            <Text noOfLines={1}>{fileNames.join(', ')}</Text>
                            <Spacer/>
                        </Flex>
                        <Text color='red'>{fileMessage}</Text>
                        <Input 
                            type="file"
                            ref={fileInputRef} 
                            style={{ display: 'none'}}
                            onChange={handleFileChange} 
                            multiple />
                        {form.slice(6)?.map((item: any, i: number) => (
                            <Box>
                                <Editable
                                textAlign='center'
                                defaultValue='Название'
                                as='b'
                                isPreviewFocusable={false}
                                >
                                    <Flex mt={3}>
                                        <EditablePreview />
                                        <Input as={EditableInput} onChange={(e: ChangeEvent<HTMLInputElement>) => 
                                            dispatch(setExtraFieldName({index: i, value: e.target.value}))}/>
                                        <EditableControls />
                                        <IconButton 
                                            aria-label='delete' 
                                            bg='red.500' 
                                            icon={<DeleteIcon color='white'/>}
                                            onClick={() => dispatch(removeField(6 + i))} 
                                            size='sm' 
                                            ml={1}/>
                                    </Flex>
                                </Editable>
                                <Input mt={3} onChange={(e: ChangeEvent<HTMLInputElement>) => 
                                            dispatch(setExtraFieldValue({index: 6 + i, value: e.target.value}))}/>
                            </Box> 
                        ))}
                        <Flex mt={5}>
                            <Button onClick={() => dispatch(addField())} color='white' bg='blue.400'>
                                <AddIcon mr={2}/> Добавить поле
                            </Button>
                            <Spacer/>
                        </Flex>
                    </FormControl>
                    {/* <ul>
                        {fileList.map((file, i) => (
                        <li key={i}>
                            {file.name} - {file.type}
                        </li>
                        ))}
                    </ul> */}
                    <Flex>
                        <Spacer/>
                        <Button mt={4} colorScheme='teal' isLoading={isSubmitting} type='submit' onClick={onSubmit}>
                            Submit
                        </Button>
                    </Flex>
                </form>
            </Box>
        </Center>
    )
}

export default Form;