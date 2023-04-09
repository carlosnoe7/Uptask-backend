import nodemailer from 'nodemailer';

export const emailRegistro=async(datos)=>{
    
    const { email, nombre, token }=datos;

    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      //Informacion del email
      const info=await transport.sendMail({
        from:'"UpTask - Administrador de Proyectos" <cuentas@uptask.com>',
        to:email,
        subject:"UpTask - Verifique su cuenta",
        text:"Comprueba tu cuenta en UpTask",
        html:`
            <p>Hola: ${nombre} Comprueba tu cuenta en UpTask</p>
            <p>¡Tu cuenta ya está casi lista!, solo debes comprobarla haciendo click en el siguiente enlace:</p>
            <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar Cuenta</a>

            <p>Si tú no creaste esta cuenta, puedes ignorar este mensaje</p>
        `

      });
};
export const emailRecuperarPassword=async(datos)=>{
    
    const { email, nombre, token }=datos;

    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      //Informacion del email
      const info=await transport.sendMail({
        from:'"UpTask - Administrador de Proyectos" <cuentas@uptask.com>',
        to:email,
        subject:"UpTask - Restablezca su contraseña",
        text:"Restablezca su contraseña en UpTask",
        html:`
            <p>Hola: ${nombre} has solicitado restablecer tu password</p>
            <p>Para generar tu nuevo password, haz click en el siguiente enlace:</p>
            <a href="${process.env.FRONTEND_URL}/forgot-password/${token}">Restablecer password</a>

            <p>Si tú no solicitaste restablecer tu password, puedes ignorar este mensaje</p>
        `

      });
};