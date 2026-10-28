-- ==========================================================
-- PROCEDIMIENTOS ALMACENADOS PARA INICIO DE SESIÓN Y REGISTRO
-- Base de datos: clients_db
-- Tabla: user (id, name, email, password, created_at)
-- ==========================================================

USE clients_db;

-- ----------------------------------------------------------
-- 1. PROCEDIMIENTO PARA REGISTRAR UN USUARIO
-- ----------------------------------------------------------
DROP PROCEDURE IF EXISTS sp_registrar_usuario;

DELIMITER //

CREATE PROCEDURE sp_registrar_usuario(
    IN p_name VARCHAR(100),
    IN p_email VARCHAR(100),
    IN p_password VARCHAR(255)
)
BEGIN
    -- Comprobar si el email ya existe
    IF EXISTS (SELECT 1 FROM `user` WHERE email = p_email) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El correo electronico ya se encuentra registrado.';
    ELSE
        -- Insertar el nuevo usuario
        INSERT INTO `user` (name, email, password)
        VALUES (p_name, p_email, p_password);

        -- Retornar el ID del nuevo usuario y mensaje de confirmación
        SELECT LAST_INSERT_ID() AS id, 'Usuario registrado exitosamente' AS mensaje;
    END IF;
END //

DELIMITER ;


-- ----------------------------------------------------------
-- 2. PROCEDIMIENTO PARA INICIO DE SESIÓN (VALIDACIÓN DIRECTA EN SQL)
-- ----------------------------------------------------------
DROP PROCEDURE IF EXISTS sp_iniciar_sesion;

DELIMITER //

CREATE PROCEDURE sp_iniciar_sesion(
    IN p_email VARCHAR(100),
    IN p_password VARCHAR(255)
)
BEGIN
    DECLARE v_user_id INT;

    SELECT id INTO v_user_id
    FROM `user`
    WHERE email = p_email AND password = p_password;

    IF v_user_id IS NOT NULL THEN
        SELECT id, name, email, created_at, 'Inicio de sesion exitoso' AS mensaje
        FROM `user`
        WHERE id = v_user_id;
    ELSE
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Correo electronico o contrasena incorrectos.';
    END IF;
END //

DELIMITER ;


-- ----------------------------------------------------------
-- 3. PROCEDIMIENTO PARA INICIO DE SESIÓN CON BCRYPT (NODE.JS)
-- ----------------------------------------------------------
DROP PROCEDURE IF EXISTS sp_obtener_usuario_login;

DELIMITER //

CREATE PROCEDURE sp_obtener_usuario_login(
    IN p_email VARCHAR(100)
)
BEGIN
    SELECT id, name, email, password, created_at
    FROM `user`
    WHERE email = p_email;
END //

DELIMITER ;
