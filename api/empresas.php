<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET,HEAD,OPTIONS,POST,PUT");
header("Access-Control-Allow-Headers: Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
include_once './config.php';

try {
    $conexaoBanco = new PDO('mysql:host='.$ServidorMysql.';dbname='.$BancoNome.';charset=utf8', $UsuarioMysql, $SenhaMysql,
    array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"));
    $conexaoBanco->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $tipoReq = $_SERVER['REQUEST_METHOD'];
    header('Content-type: application/json');
    $dados = file_get_contents('php://input');

    if($tipoReq === 'GET'){
      $empresas = array();
      foreach($conexaoBanco->query('SELECT * from empresas') as $coluna) {
          array_push($empresas, array(
            'id'                => $coluna['id'],
            'nome'              => $coluna['nome'],
            'logomarca'         => $coluna['logomarca'],
            'carimbo'           => $coluna['carimbo']
          ));
      }
      $conexaoBanco = null;
      echo json_encode($empresas);
    }else if($tipoReq === 'POST'){
      $jsonDecode = json_decode($dados, true);
      $jsonDecode = $jsonDecode['User'];
      $insertDado = $conexaoBanco->prepare(
        'INSERT INTO empresas  (nome)
         VALUES                  (:nome)');

      $insertDado->execute(array(
        ':nome'               => $jsonDecode['nome']
      ));
      if($insertDado->rowCount()){
        $idDado = $conexaoBanco->lastInsertId();
        echo json_encode( array( "status" => true, "message" => "Empresa registrada com sucesso.", "id" => $idDado) );
      }else{
        echo json_encode( array( "status" => false, "message" => "Já existe essa empresa no banco de dados.") );
      }
    }

} catch (PDOException $e) {
    print "Error!: " . $e->getMessage() . "<br/>";
    die();
}
?>
