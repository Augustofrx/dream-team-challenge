import React from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import axios from "axios";
import { useRouter } from "next/router";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Correo electrónico inválido")
    .required("El correo electrónico es obligatorio"),
  password: Yup.string().required("La contraseña es obligatoria"),
});

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="modal modal-open">
        <div className="modal-box">
          <h2 className="text-2xl font-bold mb-4">Iniciar Sesión</h2>
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={validationSchema}
            onSubmit={async (values, { setSubmitting }) => {
              try {
                const response = await axios.post(
                  `${API_BASE_URL}/auth/login`,
                  values
                );
                const { accessToken } = response.data;

                localStorage.setItem("accessToken", accessToken);

                Swal.fire({
                  title: "Inicio de Sesión Exitoso",
                  text: "Has iniciado sesión con éxito.",
                  icon: "success",
                });

                onClose();
                router.push("/home");
              } catch (error) {
                Swal.fire({
                  title: "Error",
                  text: "Hubo un problema al iniciar sesión.",
                  icon: "error",
                });
              } finally {
                setSubmitting(false);
              }
            }}
          >
            <Form>
              <div className="mb-4">
                <label className="block text-sm font-medium">
                  Correo Electrónico
                </label>
                <Field
                  type="email"
                  name="email"
                  className="input input-bordered w-full"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Contraseña</label>
                <Field
                  type="password"
                  name="password"
                  className="input input-bordered w-full"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
              <div className="modal-action">
                <button type="submit" className="btn btn-primary">
                  Iniciar Sesión
                </button>
                <button type="button" onClick={onClose} className="btn">
                  Cancelar
                </button>
              </div>
            </Form>
          </Formik>
        </div>
      </div>
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>
    </div>
  );
};

export default LoginModal;
