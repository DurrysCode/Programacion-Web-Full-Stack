import React, { useState, useEffect } from 'react';

const API_URL = "http://localhost:3000/api/alumnos";

export const AlumnosCrud = () => {
  const [alumnos, setAlumnos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  // Estado para el modal de Formulario (Crear/Editar)
  const [showModal, setShowModal] = useState(false);
  const [formAlumno, setFormAlumno] = useState({
    IdAlumno: '',
    Nombre: '',
    Apellido: '',
    Carnet: '',
    Carrera: '',
    Edad: ''
  });

  // Estado para el modal de Confirmación de Eliminación
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [idEliminar, setIdEliminar] = useState(null);

  // Cargar alumnos al montar el componente
  useEffect(() => {
    obtenerAlumnos();
  }, []);

  const showAlert = (mensaje, tipo = 'success') => {
    setAlert({ mensaje, tipo });
    setTimeout(() => setAlert(null), 4000);
  };

  // ==========================================
  // 1. GET: Consultar alumnos
  // ==========================================
  const obtenerAlumnos = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Error al consultar el servidor.");
      const data = await response.json();
      setAlumnos(data);
    } catch (error) {
      showAlert("Error al conectar con la API: " + error.message, "danger");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // Manejo de Formulario (Inputs)
  // ==========================================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormAlumno({ ...formAlumno, [name]: value });
  };

  const abrirModalNuevo = () => {
    setFormAlumno({ IdAlumno: '', Nombre: '', Apellido: '', Carnet: '', Carrera: '', Edad: '' });
    setShowModal(true);
  };

  const abrirModalEditar = (alumno) => {
    setFormAlumno(alumno);
    setShowModal(true);
  };

  // ==========================================
  // 2. POST / PUT: Guardar o Actualizar
  // ==========================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    const esEdicion = Boolean(formAlumno.IdAlumno);
    const url = esEdicion ? `${API_URL}/${formAlumno.IdAlumno}` : API_URL;
    const method = esEdicion ? "PUT" : "POST";

    const payload = {
      Nombre: formAlumno.Nombre,
      Apellido: formAlumno.Apellido,
      Carnet: formAlumno.Carnet,
      Carrera: formAlumno.Carrera,
      Edad: parseInt(formAlumno.Edad, 10)
    };

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        showAlert(data.mensaje || "Operación realizada exitosamente");
        setShowModal(false);
        obtenerAlumnos();
      } else {
        showAlert(data.mensaje || "Error al guardar el registro", "danger");
      }
    } catch (error) {
      showAlert("Error en la solicitud: " + error.message, "danger");
    }
  };

  // ==========================================
  // 3. DELETE: Eliminar
  // ==========================================
  const confirmarEliminación = (id) => {
    setIdEliminar(id);
    setShowDeleteModal(true);
  };

  const ejecutarEliminacion = async () => {
    if (!idEliminar) return;

    try {
      const response = await fetch(`${API_URL}/${idEliminar}`, { method: "DELETE" });
      const data = await response.json();

      if (response.ok) {
        showAlert(data.mensaje || "Alumno eliminado correctamente");
        obtenerAlumnos();
      } else {
        showAlert(data.mensaje || "No se pudo eliminar", "danger");
      }
    } catch (error) {
      showAlert("Error al eliminar: " + error.message, "danger");
    } finally {
      setShowDeleteModal(false);
      setIdEliminar(null);
    }
  };

  return (
    <div className="container-fluid px-4 py-4">
      {/* Navbar Superior */}
      <nav className="navbar navbar-expand-lg navbar-dark navbar-corporate shadow-sm fixed-top">
        <div className="container-fluid px-4">
          <span className="navbar-brand fw-bold">
            <i className="fa-solid fa-graduation-cap me-2"></i>
            Sistema de Control Académico
          </span>
          <span className="navbar-text text-light small">
            <i className="fa-solid fa-building me-1"></i> Módulo de Alumnos
          </span>
        </div>
      </nav>

      <div style={{ marginTop: '60px' }}>
        {/* Header Corporativo */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card card-corporate p-3 d-flex flex-row justify-content-between align-items-center">
              <div>
                <h4 className="mb-1" style={{ color: 'var(--primary-color)' }}>
                  <i className="fa-solid fa-users-gear me-2"></i>Gestión de Expedientes Estudiantiles
                </h4>
                <p className="text-muted mb-0 small">Administración y consulta en tiempo real de la nómina de alumnos.</p>
              </div>
              <button className="btn btn-primary-corp px-3" onClick={abrirModalNuevo}>
                <i className="fa-solid fa-user-plus me-2"></i>Registrar Alumno
              </button>
            </div>
          </div>
        </div>

        {/* Alertas */}
        {alert && (
          <div className={`alert alert-${alert.tipo} alert-dismissible fade show shadow-sm`} role="alert">
            <i className={`fa-solid ${alert.tipo === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation'} me-2`}></i>
            {alert.mensaje}
            <button type="button" className="btn-close" onClick={() => setAlert(null)}></button>
          </div>
        )}

        {/* Tabla principal */}
        <div className="card card-corporate">
          <div className="card-header card-header-corporate d-flex justify-content-between align-items-center py-3">
            <span><i className="fa-solid fa-list me-2"></i> Listado General de Alumnos</span>
            <button className="btn btn-sm btn-outline-secondary" onClick={obtenerAlumnos}>
              <i className="fa-solid fa-rotate me-1"></i> Actualizar
            </button>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover table-striped table-corporate mb-0">
                <thead>
                  <tr>
                    <th className="text-center">ID</th>
                    <th>Carnet</th>
                    <th>Nombre Completo</th>
                    <th>Carrera</th>
                    <th className="text-center">Edad</th>
                    <th className="text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="text-center py-4 text-muted">
                        <i className="fa-solid fa-spinner fa-spin me-2"></i>Cargando registros...
                      </td>
                    </tr>
                  ) : alumnos.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-4 text-muted">
                        No hay registros en la base de datos.
                      </td>
                    </tr>
                  ) : (
                    alumnos.map((a) => (
                      <tr key={a.IdAlumno}>
                        <td className="text-center font-monospace text-muted">{a.IdAlumno}</td>
                        <td className="fw-bold">{a.Carnet}</td>
                        <td>{a.Nombre} {a.Apellido}</td>
                        <td>{a.Carrera}</td>
                        <td className="text-center">{a.Edad}</td>
                        <td className="text-center">
                          <button 
                            className="btn btn-sm btn-outline-primary me-1" 
                            onClick={() => abrirModalEditar(a)} 
                            title="Editar"
                          >
                            <i className="fa-solid fa-pen"></i>
                          </button>
                          <button 
                            className="btn btn-sm btn-outline-danger" 
                            onClick={() => confirmarEliminación(a.IdAlumno)} 
                            title="Eliminar"
                          >
                            <i className="fa-solid fa-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Formulario (Crear/Editar) */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header text-white" style={{ backgroundColor: 'var(--primary-color)' }}>
                <h5 className="modal-title">
                  <i className="fa-solid fa-user-pen me-2"></i>
                  {formAlumno.IdAlumno ? 'Actualizar Alumno' : 'Nuevo Alumno'}
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label fw-bold">Carnet / Código Estudiantil</label>
                    <input type="text" className="form-control" name="Carnet" value={formAlumno.Carnet} onChange={handleChange} required />
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Nombre</label>
                      <input type="text" className="form-control" name="Nombre" value={formAlumno.Nombre} onChange={handleChange} required />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Apellido</label>
                      <input type="text" className="form-control" name="Apellido" value={formAlumno.Apellido} onChange={handleChange} required />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Carrera Académica</label>
                    <input type="text" className="form-control" name="Carrera" value={formAlumno.Carrera} onChange={handleChange} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Edad</label>
                    <input type="number" className="form-control" name="Edad" min="15" max="100" value={formAlumno.Edad} onChange={handleChange} required />
                  </div>
                </div>
                <div className="modal-footer bg-light">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                  <button type="submit" className="btn btn-primary-corp px-4">
                    <i className="fa-solid fa-floppy-disk me-1"></i> Guardar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal Confirmar Eliminación */}
      {showDeleteModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-sm">
            <div className="modal-content">
              <div className="modal-header bg-danger text-white py-2">
                <h6 className="modal-title"><i className="fa-solid fa-triangle-exclamation me-1"></i> Confirmación</h6>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowDeleteModal(false)}></button>
              </div>
              <div className="modal-body text-center py-3">
                <p className="mb-0">¿Está seguro de eliminar a este alumno? Esta acción no se puede deshacer.</p>
              </div>
              <div className="modal-footer justify-content-center p-2">
                <button type="button" className="btn btn-sm btn-secondary" onClick={() => setShowDeleteModal(false)}>Cancelar</button>
                <button type="button" className="btn btn-sm btn-danger" onClick={ejecutarEliminacion}>Eliminar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};