// ** React Imports
import { ChangeEvent, MouseEvent, FormEvent, ReactNode, useState, useEffect } from 'react'
import { account, teams } from '../../store/global';
import { User, LoginState, Params } from '../../store/types';

// ** Next Imports
import Link from 'next/link'
import { useRouter } from 'next/router'

// import { useRouter } from 'next/router'

// ** MUI Components
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import { styled, useTheme } from '@mui/material/styles'
import MuiCard, { CardProps } from '@mui/material/Card'
import InputAdornment from '@mui/material/InputAdornment'

// ** Icons Imports
import Google from 'mdi-material-ui/Google'
import Github from 'mdi-material-ui/Github'
import Twitter from 'mdi-material-ui/Twitter'
import Facebook from 'mdi-material-ui/Facebook'
import EyeOutline from 'mdi-material-ui/EyeOutline'
import EyeOffOutline from 'mdi-material-ui/EyeOffOutline'

// ** Configs
import themeConfig from 'src/configs/themeConfig'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import FooterIllustrationsV1 from 'src/views/pages/auth/FooterIllustration'

// ** Styled Components
const Card = styled(MuiCard)<CardProps>(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '28rem' }
}))

const LinkStyled = styled('a')(({ theme }) => ({
  fontSize: '0.875rem',
  textDecoration: 'none',
  color: theme.palette.primary.main
}))


const LoginPage = () => {


  // ** State
  const [values, setValues] = useState<LoginState>({
    email: '',
    password: '',
    showPassword: false
  })

  const [user, setUser] = useState<User>({
    $id: '',
    email: '',
    name: '',
    emailVerification: false,
  })

  // ** Hook
  const theme = useTheme()
  const router = useRouter()

  useEffect(() => {
    const updateUser = async () => {
      const { userId, secret } = router.query as unknown as Params;
      try {
      await account.updateVerification(userId, secret)
      } catch(err) {

      }
    }
    updateUser()
  }, [router.query, user])

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData =  await account.get()
        if (userData) {
          setUser(userData)
        }
        const team = await teams.list()
        if (userData.emailVerification === true && team.total > 0) {
          router.push('/dashboard')
        }
        if (team.total === 0) {
          router.push('/team')
        }
      } catch(err) {
      }
    }
    fetchUser()
  }, [])


  const handleChange = (prop: keyof LoginState) => (event: ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [prop]: event.target.value })
  }

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword })
  }

  const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }

  const loginUser = async (event: FormEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const { email, password } = values;
    try {
      await account.createEmailSession(email, password);
      const userData = await account.get() as unknown as User
      setUser(userData)
      const team = await teams.list()
      if (team.total > 0 && userData.emailVerification === true) {
        router.push('/dashboard')
      }
      if (team.total === 0) {
        router.push('/team')
      }
      if (team.total === 0 && userData.emailVerification === false) {
        alert("Please verify you email")

        return
      }
    } catch (err) {
      alert("Incorrect Username or Password")
  }
  }

  const handleClick = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const { email, password } = values;
    if (email === "" || password == "") {
      alert("All fields are required")

    return;
    }
    await loginUser(event)
  }

  

  return (
    <Box className='content-center'>
      <Card sx={{ zIndex: 1 }}>
        <CardContent sx={{ padding: theme => `${theme.spacing(12, 9, 7)} !important` }}>
          <Box sx={{ mb: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg
              width={35}
              height={29}
              version='1.1'
              viewBox='0 0 30 23'
              xmlns='http://www.w3.org/2000/svg'
              xmlnsXlink='http://www.w3.org/1999/xlink'
            >
              <g stroke='none' strokeWidth='1' fill='none' fillRule='evenodd'>
                <g id='Artboard' transform='translate(-95.000000, -51.000000)'>
                  <g id='logo' transform='translate(95.000000, 50.000000)'>
                    <path
                      id='Combined-Shape'
                      fill={theme.palette.primary.main}
                      d='M30,21.3918362 C30,21.7535219 29.9019196,22.1084381 29.7162004,22.4188007 C29.1490236,23.366632 27.9208668,23.6752135 26.9730355,23.1080366 L26.9730355,23.1080366 L23.714971,21.1584295 C23.1114106,20.7972624 22.7419355,20.1455972 22.7419355,19.4422291 L22.7419355,19.4422291 L22.741,12.7425689 L15,17.1774194 L7.258,12.7425689 L7.25806452,19.4422291 C7.25806452,20.1455972 6.88858935,20.7972624 6.28502902,21.1584295 L3.0269645,23.1080366 C2.07913318,23.6752135 0.850976404,23.366632 0.283799571,22.4188007 C0.0980803893,22.1084381 2.0190442e-15,21.7535219 0,21.3918362 L0,3.58469444 L0.00548573643,3.43543209 L0.00548573643,3.43543209 L0,3.5715689 C3.0881846e-16,2.4669994 0.8954305,1.5715689 2,1.5715689 C2.36889529,1.5715689 2.73060353,1.67359571 3.04512412,1.86636639 L15,9.19354839 L26.9548759,1.86636639 C27.2693965,1.67359571 27.6311047,1.5715689 28,1.5715689 C29.1045695,1.5715689 30,2.4669994 30,3.5715689 L30,3.5715689 Z'
                    />
                    <polygon
                      id='Rectangle'
                      opacity='0.077704'
                      fill={theme.palette.common.black}
                      points='0 8.58870968 7.25806452 12.7505183 7.25806452 16.8305646'
                    />
                    <polygon
                      id='Rectangle'
                      opacity='0.077704'
                      fill={theme.palette.common.black}
                      points='0 8.58870968 7.25806452 12.6445567 7.25806452 15.1370162'
                    />
                    <polygon
                      id='Rectangle'
                      opacity='0.077704'
                      fill={theme.palette.common.black}
                      points='22.7419355 8.58870968 30 12.7417372 30 16.9537453'
                      transform='translate(26.370968, 12.771227) scale(-1, 1) translate(-26.370968, -12.771227) '
                    />
                    <polygon
                      id='Rectangle'
                      opacity='0.077704'
                      fill={theme.palette.common.black}
                      points='22.7419355 8.58870968 30 12.6409734 30 15.2601969'
                      transform='translate(26.370968, 11.924453) scale(-1, 1) translate(-26.370968, -11.924453) '
                    />
                    <path
                      id='Rectangle'
                      fillOpacity='0.15'
                      fill={theme.palette.common.white}
                      d='M3.04512412,1.86636639 L15,9.19354839 L15,9.19354839 L15,17.1774194 L0,8.58649679 L0,3.5715689 C3.0881846e-16,2.4669994 0.8954305,1.5715689 2,1.5715689 C2.36889529,1.5715689 2.73060353,1.67359571 3.04512412,1.86636639 Z'
                    />
                    <path
                      id='Rectangle'
                      fillOpacity='0.35'
                      fill={theme.palette.common.white}
                      transform='translate(22.500000, 8.588710) scale(-1, 1) translate(-22.500000, -8.588710) '
                      d='M18.0451241,1.86636639 L30,9.19354839 L30,9.19354839 L30,17.1774194 L15,8.58649679 L15,3.5715689 C15,2.4669994 15.8954305,1.5715689 17,1.5715689 C17.3688953,1.5715689 17.7306035,1.67359571 18.0451241,1.86636639 Z'
                    />
                  </g>
                </g>
              </g>
            </svg>
            <Typography
              variant='h6'
              sx={{
                ml: 3,
                lineHeight: 1,
                fontWeight: 600,
                textTransform: 'uppercase',
                fontSize: '1.5rem !important'
              }}
            >
              {themeConfig.templateName}
            </Typography>
          </Box>
          <Box sx={{ mb: 6 }}>
            <Typography variant='h5' sx={{ fontWeight: 600, marginBottom: 1.5 }}>
              Welcome to {themeConfig.templateName}! 👋🏻
            </Typography>
            <Typography variant='body2'>Please sign-in to your account and start the adventure</Typography>
          </Box>
          <form noValidate autoComplete='off'>
            <TextField 
              fullWidth 
              type='email' 
              label='Email' 
              sx={{ marginBottom: 4 }} 
              onChange={handleChange('email')}
            />
            <FormControl fullWidth>
              <InputLabel htmlFor='auth-register-password'>Password</InputLabel>
              <OutlinedInput
                label='Password'
                value={values.password}
                id='auth-register-password'
                onChange={handleChange('password')}
                type={values.showPassword ? 'text' : 'password'}
                endAdornment={
                  <InputAdornment position='end'>
                    <IconButton
                      edge='end'
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      aria-label='toggle password visibility'
                    >
                      {values.showPassword ? <EyeOutline fontSize='small' /> : <EyeOffOutline fontSize='small' />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
            <Button 
              fullWidth size='large' 
              type='submit' 
              variant='contained' 
              sx={{ marginBottom: 7, marginTop: 8 }}
              onClick={handleClick}
            >
              Login
            </Button>
            <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
              <Typography variant='body2' sx={{ marginRight: 2 }}>
                New on our platform?
              </Typography>
              <Typography variant='body2'>
                <Link passHref href='/register'>
                  <LinkStyled>Create an account</LinkStyled>
                </Link>
              </Typography>
            </Box>
            <Divider sx={{ my: 5 }}>or</Divider>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Link href='/' passHref>
                <IconButton component='a' onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}>
                  <Facebook sx={{ color: '#497ce2' }} />
                </IconButton>
              </Link>
              <Link href='/' passHref>
                <IconButton component='a' onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}>
                  <Twitter sx={{ color: '#1da1f2' }} />
                </IconButton>
              </Link>
              <Link href='/' passHref>
                <IconButton component='a' onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}>
                  <Github
                    sx={{ color: theme => (theme.palette.mode === 'light' ? '#272727' : theme.palette.grey[300]) }}
                  />
                </IconButton>
              </Link>
              <Link href='/' passHref>
                <IconButton component='a' onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}>
                  <Google sx={{ color: '#db4437' }} />
                </IconButton>
              </Link>
            </Box>
          </form>
        </CardContent>
      </Card>
      <FooterIllustrationsV1 />
    </Box>
  )
}

LoginPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default LoginPage
