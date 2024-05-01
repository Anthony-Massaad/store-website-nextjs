"use client";

import { Card } from "primereact/card";
import { ChangeEvent, FC, useContext, useEffect, useState } from "react";
import Container from "../Container";
import { useParams, useRouter } from "next/navigation";
import { SessionContext } from "@/providers/SessionProvider";
import { toString } from "lodash";
import axios from "axios";
import { Controller, useForm } from "react-hook-form";
import { classNames } from "primereact/utils";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { changeUserDataSession } from "@/lib/utils";
import { ToastContext } from "@/providers/ToastProvider";

interface DefaultFormValues {
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  address?: string;
}

const ProfilePage: FC = () => {
  const { id } = useParams();
  const { sessionToken, userData } = useContext(SessionContext);
  const navigate = useRouter();
  const [isEditMode, setIsEditMode] = useState(false);
  const [isProcessing, setIsProccessing] = useState(false);
  const [defaultValues, setDefaultValues] = useState<DefaultFormValues>({
    username: userData?.username,
    email: userData?.email,
    firstName: userData?.firstName,
    lastName: userData?.lastName,
    address: userData?.address,
  });

  const { showToast } = useContext(ToastContext);

  useEffect(() => {
    if (userData && toString(userData?.id) === id && sessionToken) {
    } else {
      navigate.push("/");
    }
  }, [id]);

  const {
    control,
    formState: { errors },
    handleSubmit,
    clearErrors,
  } = useForm({ defaultValues });

  const getFormErrorMessage = (name: string) => {
    return (errors as any)[name] ? (
      <small className="p-error block mt-1">
        {(errors as any)[name].message}
      </small>
    ) : (
      <small className="p-error block mt-1">&nbsp;</small>
    );
  };

  const handleValueChange = (fieldName: string, value: string) => {
    setDefaultValues((prevState) => ({
      ...prevState,
      [fieldName]: value,
    }));
  };

  const onSubmit = async (data: DefaultFormValues) => {
    setIsProccessing(true);
    const stringData = JSON.stringify({ id: userData?.id, ...data });
    await axios
      .post("/api/v1/user/update", stringData)
      .then(async (res) => {
        if (res.status === 200 && res.data.success) {
          await changeUserDataSession(res.data.userData);
          setIsEditMode(false);
          setIsProccessing(false);
          showToast("success", "Updated", res.data.msg);
        } else {
          console.log(res.data.msg);
          showToast("error", "Oops", res.data.msg);
        }
      })
      .catch((err) => {
        console.error(err);
        showToast("error", "Oops", "Cannot update user information");
      });
  };

  return (
    <Container
      contentContainer
      classNames="flex align-content-center justify-content-center"
    >
      <Card className="w-9 w-auto md:w-max">
        <h2 className="px-4 pt-4">Profile Page</h2>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-4"
          autoComplete="off"
        >
          <div className="flex flex-column md:flex-row column-gap-3 mb-2 mt-2">
            <Controller
              name="email"
              control={control}
              rules={{ required: "Email Required" }}
              render={({ field, fieldState }) => (
                <div className="mb-2">
                  <label
                    htmlFor={field.name}
                    className={`block mb-2 ${classNames({
                      "p-error": errors[field.name],
                    })}`}
                  >
                    Email
                  </label>
                  <InputText
                    id={field.name}
                    value={field.value}
                    className={`w-full ${classNames({
                      "p-invalid": fieldState.error,
                    })}`}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      errors[field.name] && clearErrors(field.name);
                      field.onChange(e.target.value);
                      handleValueChange(field.name, e.target.value);
                    }}
                    disabled={!isEditMode || isProcessing}
                    type="text"
                  />
                  {getFormErrorMessage(field.name)}
                </div>
              )}
            />
            <Controller
              name="username"
              control={control}
              rules={{ required: "Username Required" }}
              render={({ field, fieldState }) => (
                <div>
                  <label
                    htmlFor={field.name}
                    className={`block mb-2 ${classNames({
                      "p-error": errors[field.name],
                    })}`}
                  >
                    Username
                  </label>
                  <InputText
                    id={field.name}
                    value={field.value}
                    className={`w-full ${classNames({
                      "p-invalid": fieldState.error,
                    })}`}
                    disabled={!isEditMode || isProcessing}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      errors[field.name] && clearErrors(field.name);
                      field.onChange(e.target.value);
                      handleValueChange(field.name, e.target.value);
                    }}
                    type="text"
                  />
                  {getFormErrorMessage(field.name)}
                </div>
              )}
            />
          </div>
          <div className="flex flex-column md:flex-row column-gap-3 mb-2 mt-2">
            <Controller
              name="firstName"
              control={control}
              rules={{ required: "First Name Required" }}
              render={({ field, fieldState }) => (
                <div className="mb-2">
                  <label
                    htmlFor={field.name}
                    className={`block mb-2 ${classNames({
                      "p-error": errors[field.name],
                    })}`}
                  >
                    First Name
                  </label>
                  <span className="p-float-label">
                    <InputText
                      id={field.name}
                      value={field.value}
                      className={`w-full ${classNames({
                        "p-invalid": fieldState.error,
                      })}`}
                      disabled={!isEditMode || isProcessing}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        errors[field.name] && clearErrors(field.name);
                        field.onChange(e.target.value);
                        handleValueChange(field.name, e.target.value);
                      }}
                      type="text"
                    />
                  </span>
                  {getFormErrorMessage(field.name)}
                </div>
              )}
            />
            <Controller
              name="lastName"
              control={control}
              rules={{ required: "Last Name Required" }}
              render={({ field, fieldState }) => (
                <div>
                  <label
                    htmlFor={field.name}
                    className={`block mb-2 ${classNames({
                      "p-error": errors[field.name],
                    })}`}
                  >
                    Last Name
                  </label>
                  <InputText
                    id={field.name}
                    value={field.value}
                    className={`w-full ${classNames({
                      "p-invalid": fieldState.error,
                    })}`}
                    disabled={!isEditMode || isProcessing}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      errors[field.name] && clearErrors(field.name);
                      field.onChange(e.target.value);
                      handleValueChange(field.name, e.target.value);
                    }}
                    type="text"
                  />
                  {getFormErrorMessage(field.name)}
                </div>
              )}
            />
          </div>
          <Controller
            name="address"
            control={control}
            rules={{ required: "Address Required" }}
            render={({ field, fieldState }) => (
              <div className="mb-2">
                <label
                  htmlFor={field.name}
                  className={`block mb-2 ${classNames({
                    "p-error": errors[field.name],
                  })}`}
                >
                  Address
                </label>
                <InputText
                  id={field.name}
                  value={field.value}
                  className={`w-full ${classNames({
                    "p-invalid": fieldState.error,
                  })}`}
                  disabled={!isEditMode || isProcessing}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    errors[field.name] && clearErrors(field.name);
                    field.onChange(e.target.value);
                    handleValueChange(field.name, e.target.value);
                  }}
                  type="text"
                />
                {getFormErrorMessage(field.name)}
              </div>
            )}
          />
          <div className="flex flex-column md:flex-row column-gap-5">
            <Button
              type="button"
              label="Edit"
              icon="pi pi-pencil"
              className="mx-auto mt-3 w-full"
              disabled={isEditMode || isProcessing}
              onClick={() => {
                setIsEditMode(true);
              }}
            ></Button>
            <Button
              type="submit"
              label="Save"
              icon="pi pi-save"
              severity="success"
              className=" mx-auto mt-3 w-full"
              disabled={!isEditMode || isProcessing}
            ></Button>
          </div>
          <Button
            type="button"
            label="Cancel"
            icon="pi pi-times-circle"
            className="mx-auto mt-3 w-full"
            severity="danger"
            disabled={!isEditMode || isProcessing}
            onClick={() => {
              setIsEditMode(false);
            }}
          ></Button>
        </form>
      </Card>
    </Container>
  );
};

export default ProfilePage;
