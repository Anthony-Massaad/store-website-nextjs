"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import { Stepper } from "primereact/stepper";
import { StepperPanel } from "primereact/stepperpanel";
import {
  ChangeEvent,
  FC,
  ReactElement,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Controller, useForm } from "react-hook-form";
import { ToastContext } from "@/providers/ToastProvider";

interface DefaultFormValues {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  address: string;
}

const RegisterPage: FC = () => {
  const [incorrect, setIncorrect] = useState(false);
  const [incorrectMessage, setIncorrectMessage] = useState("");

  const [loading, setLoading] = useState(false);
  const [defaultValues, setDefaultValues] = useState<DefaultFormValues>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    address: "",
  });

  const stepperRef = useRef(null);

  const navigate = useRouter();

  const { showToast } = useContext(ToastContext);

  const {
    control,
    formState: { errors },
    handleSubmit,
    clearErrors,
  } = useForm({ defaultValues });

  const validateInput = (data: DefaultFormValues): boolean => {
    if (data.confirmPassword !== data.password) return false;
    return true;
  };

  const onSubmit = async (data: DefaultFormValues) => {
    setLoading(true);

    if (!validateInput(data)) {
      setIncorrect(true);
      setIncorrectMessage("Passwords Do not Match!");
      setLoading(false);
      (stepperRef.current as any).prevCallback();
      return;
    }

    const stringData = JSON.stringify(data);

    await axios
      .post("/api/v1/register", stringData)
      .then(async (res) => {
        console.log(res);
        if (res.status === 200 && res.data.success) {
          showToast("success", "Created", "User profile created!");
          navigate.push("/");
        } else {
          setIncorrect(true);
          setIncorrectMessage(res.data.msg);
          setLoading(false);
          (stepperRef.current as any).prevCallback();
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const getFormErrorMessage = (name: string) => {
    return (errors as any)[name] ? (
      <small className="p-error">{(errors as any)[name].message}</small>
    ) : (
      <small className="p-error">&nbsp;</small>
    );
  };

  const handleValueChange = (fieldName: string, value: string) => {
    setDefaultValues((prevState) => ({
      ...prevState,
      [fieldName]: value,
    }));
  };

  const essentialInfoPanel = (): ReactElement => {
    return (
      <StepperPanel header="Info 1">
        <Controller
          name="email"
          control={control}
          rules={{ required: "Email Required" }}
          render={({ field, fieldState }) => (
            <div className="mt-4">
              <label
                htmlFor={field.name}
                className={`${classNames({ "p-error": errors[field.name] })}`}
              ></label>
              <span className="p-float-label">
                <InputText
                  id={field.name}
                  value={field.value}
                  className={`${classNames({
                    "p-invalid": fieldState.error,
                  })}`}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    errors.email && clearErrors("email");
                    field.onChange(e.target.value);
                    handleValueChange(field.name, e.target.value);
                  }}
                  type="text"
                />
                <label htmlFor={field.name} className="input-label">
                  Email Address
                </label>
              </span>
              {getFormErrorMessage(field.name)}
            </div>
          )}
        />
        <Controller
          name="password"
          control={control}
          rules={{ required: "Password Required" }}
          render={({ field, fieldState }) => (
            <div className="mt-2">
              <label
                htmlFor={field.name}
                className={`${classNames({
                  "p-error": errors[field.name],
                })}`}
              ></label>
              <span className="p-float-label">
                <InputText
                  id={field.name}
                  value={field.value}
                  className={classNames({
                    "p-invalid": fieldState.error,
                  })}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    errors.password && clearErrors(field.name);
                    field.onChange(e.target.value);
                    handleValueChange(field.name, e.target.value);
                  }}
                  type="password"
                />
                <label htmlFor={field.name} className="input-label">
                  Password
                </label>
              </span>
              {getFormErrorMessage(field.name)}
            </div>
          )}
        />
        <Controller
          name="confirmPassword"
          control={control}
          rules={{ required: "Password Required" }}
          render={({ field, fieldState }) => (
            <div className="mt-2">
              <label
                htmlFor={field.name}
                className={`${classNames({
                  "p-error": errors[field.name],
                })}`}
              ></label>
              <span className="p-float-label">
                <InputText
                  id={field.name}
                  value={field.value}
                  className={classNames({
                    "p-invalid": fieldState.error,
                  })}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    errors.confirmPassword && clearErrors(field.name);
                    field.onChange(e.target.value);
                    handleValueChange(field.name, e.target.value);
                  }}
                  type="password"
                />
                <label htmlFor={field.name} className="input-label">
                  Confirm Password
                </label>
              </span>
              {getFormErrorMessage(field.name)}
            </div>
          )}
        />
        {incorrect && <small className="p-error">{incorrectMessage}</small>}
        <div className="flex justify-content-end mt-2">
          <Button
            label="Next"
            icon="pi pi-arrow-right"
            iconPos="right"
            disabled={
              !defaultValues.email ||
              !defaultValues.password ||
              !defaultValues.confirmPassword
            }
            onClick={() => (stepperRef.current as any).nextCallback()}
          />
        </div>
      </StepperPanel>
    );
  };

  const additionalInfoPanel = (): ReactElement => {
    return (
      <StepperPanel header="Info 2">
        <Controller
          name="username"
          control={control}
          rules={{ required: "Username Required" }}
          render={({ field, fieldState }) => (
            <div className="mt-4">
              <label
                htmlFor={field.name}
                className={`${classNames({ "p-error": errors[field.name] })}`}
              ></label>
              <span className="p-float-label">
                <InputText
                  id={field.name}
                  value={field.value}
                  className={`${classNames({
                    "p-invalid": fieldState.error,
                  })}`}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    errors.username && clearErrors(field.name);
                    field.onChange(e.target.value);
                    handleValueChange(field.name, e.target.value);
                  }}
                  type="text"
                />
                <label htmlFor={field.name} className="input-label">
                  Username
                </label>
              </span>
              {getFormErrorMessage(field.name)}
            </div>
          )}
        />
        <Controller
          name="firstName"
          control={control}
          rules={{ required: "First Name Required" }}
          render={({ field, fieldState }) => (
            <div className="mt-2">
              <label
                htmlFor={field.name}
                className={`${classNames({ "p-error": errors[field.name] })}`}
              ></label>
              <span className="p-float-label">
                <InputText
                  id={field.name}
                  value={field.value}
                  className={`${classNames({
                    "p-invalid": fieldState.error,
                  })}`}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    errors.firstName && clearErrors(field.name);
                    field.onChange(e.target.value);
                    handleValueChange(field.name, e.target.value);
                  }}
                  type="text"
                />
                <label htmlFor={field.name} className="input-label">
                  First Name
                </label>
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
            <div className="mt-2">
              <label
                htmlFor={field.name}
                className={`${classNames({
                  "p-error": errors[field.name],
                })}`}
              ></label>
              <span className="p-float-label">
                <InputText
                  id={field.name}
                  value={field.value}
                  className={classNames({
                    "p-invalid": fieldState.error,
                  })}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    errors.lastName && clearErrors(field.name);
                    field.onChange(e.target.value);
                    handleValueChange(field.name, e.target.value);
                  }}
                  type="text"
                />
                <label htmlFor={field.name} className="input-label">
                  Last Name
                </label>
              </span>
              {getFormErrorMessage(field.name)}
            </div>
          )}
        />
        <Controller
          name="address"
          control={control}
          rules={{ required: "Address Required" }}
          render={({ field, fieldState }) => (
            <div className="mt-2 mb-2">
              <label
                htmlFor={field.name}
                className={`${classNames({
                  "p-error": errors[field.name],
                })}`}
              ></label>
              <span className="p-float-label">
                <InputText
                  id={field.name}
                  value={field.value}
                  className={classNames({
                    "p-invalid": fieldState.error,
                  })}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    errors.address && clearErrors(field.name);
                    field.onChange(e.target.value);
                    handleValueChange(field.name, e.target.value);
                  }}
                  type="text"
                />
                <label htmlFor={field.name} className="input-label">
                  Address
                </label>
              </span>
              {getFormErrorMessage(field.name)}
            </div>
          )}
        />
        <div className="flex justify-content-between column-gap-1">
          <Button
            label="Back"
            severity="secondary"
            icon="pi pi-arrow-left"
            onClick={() => (stepperRef.current as any).prevCallback()}
          />
          <Button
            type="submit"
            label="Register"
            icon="pi pi-user-plus"
            className="w-7rem mx-auto"
            disabled={
              loading ||
              !defaultValues.firstName ||
              !defaultValues.lastName ||
              !defaultValues.address
            }
          ></Button>
        </div>
      </StepperPanel>
    );
  };

  return (
    <Card className="login-sign-up-container shadow-3 m-1">
      <div className="flex flex-column md:flex-row">
        <div className="w-full md:w-8 flex flex-column align-items-center justify-content-center gap-3 py-5">
          <h2>Register</h2>
          <p className="text-center w-full">
            All information must be filled to continue
          </p>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-column gap-2 justify-content-center align-items-center"
            autoComplete="off"
          >
            <Stepper ref={stepperRef} linear>
              {essentialInfoPanel()}
              {additionalInfoPanel()}
            </Stepper>
          </form>
        </div>

        <div className="w-full md:w-2">
          <Divider layout="vertical" className="hidden md:flex">
            <b>OR</b>
          </Divider>
          <Divider
            layout="horizontal"
            className="flex md:hidden"
            align="center"
          >
            <b>OR</b>
          </Divider>
        </div>
        <div className="w-full md:w-5 flex align-items-center justify-content-center py-5">
          <Link href="/login">
            <Button
              label="Sign In"
              icon="pi pi-user"
              severity="success"
              className="w-10rem"
            ></Button>
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default RegisterPage;
