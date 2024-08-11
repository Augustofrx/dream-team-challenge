import React from "react";
import { Formik, Field, Form, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const validationSchema = Yup.object({
  name: Yup.string().required("El nombre de usuario es obligatorio"),
  email: Yup.string()
    .email("Correo electrónico inválido")
    .required("El correo electrónico es obligatorio"),
  password: Yup.string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .required("La contraseña es obligatoria"),
});

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="modal modal-open">
        <div className="modal-box">
          <h2 className="text-2xl font-bold mb-4">Registrarse</h2>
          <Formik
            initialValues={{ name: "", email: "", password: "" }}
            validationSchema={validationSchema}
            onSubmit={async (values, { setSubmitting }: FormikHelpers<any>) => {
              try {
                await axios.post(`${API_BASE_URL}/auth/register`, values);
                Swal.fire({
                  title: "Registro Exitoso",
                  text: "Te has registrado con éxito. Puedes iniciar sesión ahora.",
                  icon: "success",
                });
                onClose();
              } catch (error) {
                Swal.fire({
                  title: "Error",
                  text: "Hubo un problema al registrarte.",
                  icon: "error",
                });
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ isSubmitting }) => (
              <Form>
                <div className="mb-4">
                  <label className="block text-sm font-medium">
                    Nombre de Usuario
                  </label>
                  <Field
                    disabled={isSubmitting}
                    type="text"
                    name="name"
                    className="input input-bordered w-full"
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium">
                    Correo Electrónico
                  </label>
                  <Field
                    disabled={isSubmitting}
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
                  <label className="block text-sm font-medium">
                    Contraseña
                  </label>
                  <Field
                    disabled={isSubmitting}
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
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Registrando..." : "Registrarse"}{" "}
                  </button>
                  <button type="button" onClick={onClose} className="btn">
                    Cancelar
                  </button>
                </div>
              </Form>
            )}
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

export default RegisterModal;
