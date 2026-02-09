import React, { useState } from 'react';
import { Material } from "../../types/materialType";
import "../../styles/forms.css";

type Props = {
  onSubmit: (material: Omit<Material, "_id" | "fechaSubida">) => void;
};

const MaterialForm = ({ onSubmit }: Props) => {
  const [formData, setFormData] = useState<Omit<Material, "_id" | "fechaSubida">>({
    titulo: "",
    tipo: "PDF",
    enlace: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { [key: string]: string } = {};
    if (!formData.titulo.trim()) {
      newErrors.titulo = "El título es requerido";
    }
    if (!formData.enlace.trim()) {
      newErrors.enlace = "El enlace es requerido";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="forms">
      <h2>Agregar Material</h2>

      <label htmlFor="titulo">Título del Material</label>
      <input
        id="titulo"
        name="titulo"
        value={formData.titulo}
        onChange={handleChange}
        placeholder="Ej: Introducción a React"
      />
      {errors.titulo && <p className="error">{errors.titulo}</p>}

      <label htmlFor="tipo">Tipo de Material</label>
      <select
        id="tipo"
        name="tipo"
        value={formData.tipo}
        onChange={handleChange}
      >
        <option value="PDF">PDF</option>
        <option value="VIDEO">VIDEO</option>
        <option value="DOCUMENTO">DOCUMENTO</option>
        <option value="ENLACE">ENLACE</option>
        <option value="OTRO">OTRO</option>
      </select>

      <label htmlFor="enlace">Enlace del Material</label>
      <input
        id="enlace"
        name="enlace"
        type="url"
        value={formData.enlace}
        onChange={handleChange}
        placeholder="Ej: https://ejemplo.com/archivo.pdf"
      />
      {errors.enlace && <p className="error">{errors.enlace}</p>}

      <button type="submit" className="boton-formulario">
        Crear Material
      </button>
    </form>
  );
};

export default MaterialForm;
