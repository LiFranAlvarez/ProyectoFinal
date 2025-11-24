V1 - frontend

QUE AGREGUE?
Agregue el primer formulario de registro, para poner nombre email y contraseña.Ademas hay validaciones de email y longitud de la contraseña.

DONDE?
/src
├── main.tsx                  MONTA EL REACTS EN EL DOM
├── pages/ 
│   └── registroPages.tsx      ES EL FORMULARIO
├── components/
│   └── registroForms.tsx      MUESTRA EL FORMULARIO
├── types/
│   └── userType.ts           INTERFACE TIPEADA POR EL USUARIO
├── utils/
│   └── validacionesUtils.ts  FUNCIONES DE VALIDACION EMAIL Y CONTRASEÑA
index.html                    CONTIENE EL DIV ID="root"
App.tsx                       CARGA PAGINA PRINCIPAL  

COMO?
npm create vite@latest // elegi typescript y react+components(creo que es ese)
npm install react react-dom
npm install --save-dev typescript
npm install --save-dev @types/react
npm install --save-dev @types/node

V2 - frontend

QUE AGREGUE?
Agregue el formulario del login, con email y contraseña.Hay unas validaciones con zod.
Tambien modifique las validacion de contraseña del registro
Agregue la pagina home, e hice el header (con un logo) y el footer.
Cambie el nombre de algunas carpetas y corregi algunas falta de otrtografia.
Agregue algun que otro style(despues lo tengo ue poner bien el los css, estan en las etiquetas).

DONDE?
/src
├── components/ 
│   ├── footer.tsx
│   ├── header.tsx      
│   └── loginForm.tsx         ES EL FORMULARIO LOGIN
├── pages/
│   ├── homePages.tsx         MUESTRA LA PAGINA PRINCIPAL
│   └── loginPages.tsx        MUESTRA EL FORMULARIO LOGUIN
├── services/
│   └── authServices.ts       AUTENTICACION / LLAMA AL BACKEND PARA LOS LOGINS
├── utils/
│   └── validacionesLogin.ts  FUNCIONES DE VALIDACION EMAIL Y CONTRASEÑA CON ZOD PARA EL LOGIN
└── assets/
    └──icons/
        └──logo.png           LOGO X CREADO POR MI PARA EL PROYECTO

QUE MÁS?
npm install react-router-dom      (para hacer el header y que aparescan todo en distintas paginas)
npm install zod
npm install axion