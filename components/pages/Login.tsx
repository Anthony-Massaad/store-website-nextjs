"use client";

import { loginFunc } from "@/lib/utils";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import { ChangeEvent, FC, useState } from "react";
import { Controller, useForm } from "react-hook-form";

interface DefaultFormValues {
  email: string;
  password: string;
}

const LoginPage: FC = () => {
  const [incorrect, setIncorrect] = useState(false);
  const [loading, setLoading] = useState(false);
  const defaultValues: DefaultFormValues = {
    email: "",
    password: "",
  };

  const navigate = useRouter();

  const {
    control,
    formState: { errors },
    handleSubmit,
    clearErrors,
  } = useForm({ defaultValues });

  const onSubmit = async (data: DefaultFormValues) => {
    setLoading(true);
    const stringData = JSON.stringify(data);
    await axios
      .post("/api/v1/signIn", stringData)
      .then(async (res) => {
        if (res.status === 200) {
          await loginFunc(data);
          navigate.push("/");
        } else {
          setIncorrect(true);
          setLoading(false);
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

  return (
    <Card className="login-sign-up-container shadow-3 m-1">
      <div className="flex flex-column md:flex-row">
        <div className="w-full md:w-5 flex flex-column align-items-center justify-content-center gap-3 py-5">
          <h2 className="mb-4">Login</h2>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-column gap-2 justify-content-center align-items-center"
            autoComplete="off"
          >
            <Controller
              name="email"
              control={control}
              rules={{ required: "Email Required" }}
              render={({ field, fieldState }) => (
                <div className="mb-3">
                  <label
                    htmlFor={field.name}
                    className={`${classNames({ "p-error": errors.email })}`}
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
                      }}
                      type="text"
                    />
                    <label htmlFor={field.name} className="input-label">
                      Email
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
                <div>
                  <label
                    htmlFor={field.name}
                    className={`${classNames({
                      "p-error": errors.password,
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
                        errors.password && clearErrors("password");
                        field.onChange(e.target.value);
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
            {incorrect && (
              <small className="p-error">Incorrect email or password</small>
            )}
            <Button
              type="submit"
              label="Login"
              icon="pi pi-user"
              className="w-10rem mx-auto mt-3"
              disabled={loading}
            ></Button>
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
          <Link href="/register">
            <Button
              label="Sign Up"
              icon="pi pi-user-plus"
              severity="success"
              className="w-10rem"
            ></Button>
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default LoginPage;
