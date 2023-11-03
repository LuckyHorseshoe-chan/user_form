import { useForm } from 'react-hook-form'
import {
  FormErrorMessage,
  FormLabel,
  FormControl,
  Input,
  Button,
  Text,
  Box,
  Center
} from '@chakra-ui/react'
import MapComponent from './MapComponent'

type FormData = {
    firstName: string
    lastName: string
    patronymic: string
    email: string
    phone: string
}

function Form(){
    const {
        handleSubmit,
        register,
        formState: { errors, isSubmitting },
    } = useForm<FormData>()

    function onSubmit(values: any) {
        return new Promise(() => {
          setTimeout(() => {
            alert(JSON.stringify(values, null, 2))
          }, 3000)
        })
      }

    return(
        <Center>
            <Box w='50vw' mt={10}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <FormControl>
                        <FormLabel htmlFor='lastName'>Фамилия</FormLabel>
                        <Input
                            id='lastName'
                            {...register('lastName', {
                                required: 'Это обязательное поле!',
                                pattern: {value: /^[А-ЯЁ][а-яё]+$/, message: 'Некорректные данные'}
                            })}
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
                            isInvalid={errors.email ? true : false}
                        />
                        <Text color='red'>
                            {errors.email?.message}
                        </Text>
                        <FormLabel htmlFor='phone'>Телефон</FormLabel>
                        <Input
                            id='phone'
                            placeholder="+7(999)999-99-99"
                            {...register('phone', {
                                required: 'Это обязательное поле!',
                                pattern: {value: /\+7\(\d{3}\)\d{3}-\d{2}-\d{2}/, message: 'Некорректные данные'}
                            })}
                            isInvalid={errors.phone ? true : false}
                        />
                        <Text color='red'>
                            {errors.phone?.message}
                        </Text>
                    </FormControl>
                    <MapComponent/>
                    <Button mt={4} colorScheme='teal' isLoading={isSubmitting} type='submit'>
                        Submit
                    </Button>
                </form>
            </Box>
        </Center>
    )
}

export default Form;