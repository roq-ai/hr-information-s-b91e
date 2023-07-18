import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getInsightById, updateInsightById } from 'apiSdk/insights';
import { Error } from 'components/error';
import { insightValidationSchema } from 'validationSchema/insights';
import { InsightInterface } from 'interfaces/insight';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { UserInterface } from 'interfaces/user';
import { getUsers } from 'apiSdk/users';

function InsightEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<InsightInterface>(
    () => (id ? `/insights/${id}` : null),
    () => getInsightById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: InsightInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateInsightById(id, values);
      mutate(updated);
      resetForm();
      router.push('/insights');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<InsightInterface>({
    initialValues: data,
    validationSchema: insightValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Edit Insight
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <FormControl id="trending_topics" mb="4" isInvalid={!!formik.errors?.trending_topics}>
              <FormLabel>Trending Topics</FormLabel>
              <Input
                type="text"
                name="trending_topics"
                value={formik.values?.trending_topics}
                onChange={formik.handleChange}
              />
              {formik.errors.trending_topics && <FormErrorMessage>{formik.errors?.trending_topics}</FormErrorMessage>}
            </FormControl>
            <FormControl id="audience_engagement" mb="4" isInvalid={!!formik.errors?.audience_engagement}>
              <FormLabel>Audience Engagement</FormLabel>
              <Input
                type="text"
                name="audience_engagement"
                value={formik.values?.audience_engagement}
                onChange={formik.handleChange}
              />
              {formik.errors.audience_engagement && (
                <FormErrorMessage>{formik.errors?.audience_engagement}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl id="influencer_metrics" mb="4" isInvalid={!!formik.errors?.influencer_metrics}>
              <FormLabel>Influencer Metrics</FormLabel>
              <Input
                type="text"
                name="influencer_metrics"
                value={formik.values?.influencer_metrics}
                onChange={formik.handleChange}
              />
              {formik.errors.influencer_metrics && (
                <FormErrorMessage>{formik.errors?.influencer_metrics}</FormErrorMessage>
              )}
            </FormControl>
            <AsyncSelect<UserInterface>
              formik={formik}
              name={'user_id'}
              label={'Select User'}
              placeholder={'Select User'}
              fetcher={getUsers}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.email}
                </option>
              )}
            />
            <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
              Submit
            </Button>
          </form>
        )}
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'insight',
    operation: AccessOperationEnum.UPDATE,
  }),
)(InsightEditPage);
