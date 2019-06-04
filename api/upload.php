<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET,HEAD,OPTIONS,POST,PUT,FILES");
header("Access-Control-Allow-Headers: Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
include_once './config.php';

try {
    $conexaoBanco = new PDO('mysql:host='.$ServidorMysql.';dbname='.$BancoNome.';charset=utf8', $UsuarioMysql, $SenhaMysql,
    array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"));
    $conexaoBanco->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $tipoReq = $_SERVER['REQUEST_METHOD'];

    if($tipoReq === 'POST'){
      $pathFileLogo =  "upload/logo/" . basename($_FILES["imageLogo"]["name"]);
      $pathFileCarimbo = "upload/carimbo/"  . basename($_FILES["imageCarimbo"]["name"]);

      if ( move_uploaded_file($_FILES["imageLogo"]["tmp_name"], $pathFileLogo) )
        if ( move_uploaded_file($_FILES["imageCarimbo"]["tmp_name"], $pathFileCarimbo) )
          {
            $updateEmpresa = $conexaoBanco->prepare('UPDATE coligadas SET logomarca = :pathlogo, carimbo = :pathcarimbo WHERE id = :id');
            $updateEmpresa->execute(array(
              ':pathlogo'     => $pathFileLogo,
              ':pathcarimbo'  => $pathFileCarimbo,
              ':id'           => $_POST['idEmpresa'],
            ));

            if($updateEmpresa->rowCount())
              echo 'Sucesso';
            else
              echo 'Erro na atualização de imagens no banco de dados';
          }
        else
          echo 'Erro no upload da imagem Carimbo';
       else
        echo 'Erro no upload da imagem Logo';

    }

} catch (PDOException $e) {
    print "Error!: " . $e->getMessage() . "<br/>";
    die();
}
?>
