import { useTranslation } from 'react-i18next';
import { useForm, UseFormMethods } from 'react-hook-form';
import randomString, { encryptMessage, postSecret } from '../utils/utils';
import Result from '../displaySecret/Result';
import Expiration from './../shared/Expiration';
import {
  Alert,
  Checkbox,
  FormGroup,
  FormControlLabel,
  TextField,
  Typography,
  Button,
  Grid,
  Box,
  InputLabel,
} from '@material-ui/core';
import { useAuth } from 'oidc-react';
import React, { useState, useEffect } from 'react';

const CreateSecret = () => {
  const { t } = useTranslation();
  const {
    control,
    register,
    errors,
    handleSubmit,
    watch,
    setError,
    clearErrors,
  } = useForm({
    defaultValues: {
      generateDecryptionKey: true,
      secret: '',
    },
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState({
    password: '',
    uuid: '',
    customPassword: false,
  });

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>): void => {
    if (event.ctrlKey && event.key === 'Enter') {
      handleSubmit(onSubmit)();
    }
  };

  const onSubmit = async (form: any): Promise<void> => {
    // Use the manually entered password, or generate one
    const pw = form.password ? form.password : randomString();
    setLoading(true);
    try {
      const { data, status } = await postSecret({
        expiration: parseInt(form.expiration),
        message: await encryptMessage(form.secret, pw),
        one_time: form.onetime,
      });

      if (status !== 200) {
        setError('secret', { type: 'submit', message: data.message });
      } else {
        setResult({
          customPassword: form.password ? true : false,
          password: pw,
          uuid: data.message,
        });
      }
    } catch (e) {
      setError('secret', { type: 'submit', message: e.message });
    }
    setLoading(false);
  };

  const generateDecryptionKey = watch('generateDecryptionKey');

  var auth = useAuth();

  var isUserLoggedOut = !auth?.userData;

  var username = auth?.userData?.profile?.username;
  console.log(username);

  var login = () => {
    if (!auth) {
      console.error('Unknown error.');
      return;
    }

    var login = isUserLoggedOut ? auth.signIn : auth.signOut;

    login().then(console.log).catch(console.error);
  };
  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    if (isUserLoggedOut) {
      return login();
    }
  });

  if (result.uuid) {
    return (
      <Result
        password={result.password}
        uuid={result.uuid}
        prefix="s"
        customPassword={result.customPassword}
      />
    );
  }

  return (
    <>
      <Error
        message={errors.secret?.message}
        onClick={() => clearErrors('secret')}
      />
      <Typography component="h1" variant="h4" align="center">
        {t('Encrypt message')}
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container justifyContent="center" paddingTop={1}>
          <TextField
            inputRef={register({ required: true })}
            multiline={true}
            name="secret"
            margin="dense"
            fullWidth
            label={t('Secret message')}
            rows="4"
            autoFocus={true}
            onKeyDown={onKeyDown}
            placeholder={t('Message to encrypt locally in your browser')}
            inputProps={{ spellCheck: 'false', 'data-gramm': 'false' }}
          />
          <Grid container justifyContent="center" marginTop={2}>
            <Expiration control={control} />
          </Grid>
          <Grid container alignItems="center" direction="column">
            <OneTime register={register} />
            <SpecifyPasswordToggle register={register} />
            {!generateDecryptionKey && (
              <SpecifyPasswordInput register={register} />
            )}
          </Grid>
          <Grid container justifyContent="center">
            <Box p={2} pb={4}>
              <Button variant="contained" disabled={loading}>
                {loading ? (
                  <span>{t('Encrypting message...')}</span>
                ) : (
                  <span>{t('Encrypt Message')}</span>
                )}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </>
  );
};

export const Error = (props: { message?: string; onClick?: () => void }) =>
  props.message ? (
    <Alert severity="error" {...props}>
      {props.message}
    </Alert>
  ) : null;

export const OneTime = (props: { register: UseFormMethods['register'] }) => {
  const { t } = useTranslation();
  return (
    <Grid item justifyContent="center">
      <FormControlLabel
        control={
          <Checkbox
            id="enable-onetime"
            name="onetime"
            inputRef={props.register()}
            defaultChecked={true}
            color="primary"
          />
        }
        label={t('One-time download')}
      />
    </Grid>
  );
};

export const SpecifyPasswordInput = (props: {
  register: UseFormMethods['register'];
}) => {
  const { t } = useTranslation();
  return (
    <Grid item justifyContent="center">
      <InputLabel>{t('Custom decryption key')}</InputLabel>
      <TextField
        fullWidth
        type="text"
        id="password"
        inputRef={props.register()}
        name="password"
        variant="outlined"
        inputProps={{
          autoComplete: 'off',
          spellCheck: 'false',
          'data-gramm': 'false',
        }}
      />
    </Grid>
  );
};

export const SpecifyPasswordToggle = (props: {
  register: UseFormMethods['register'];
}) => {
  const { t } = useTranslation();
  return (
    <FormGroup>
      <FormControlLabel
        control={
          <Checkbox
            name="generateDecryptionKey"
            inputRef={props.register()}
            defaultChecked={true}
            color="primary"
          />
        }
        label={t('Generate decryption key')}
      />
    </FormGroup>
  );
};

export default CreateSecret;
