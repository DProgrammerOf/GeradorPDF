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
      foreach($conexaoBanco->query('SELECT * from coligadas') as $coluna) {
          array_push($empresas, array(
            'id'                => $coluna['id'],
            'nome'              => $coluna['nome'],
            'rua'               => $coluna['rua'],
            'cidade'            => $coluna['cidade'],
            'estado'            => $coluna['estado'],
            'cnpjmf'            => $coluna['cnpjmf'],
            'statusinscricao'   => $coluna['statusinscricao'],
            'logomarca'         => $coluna['logomarca'],
            'carimbo'           => $coluna['carimbo'],
            'cep'               =>  $coluna['cep']
          ));
      }
      $conexaoBanco = null;
      echo json_encode($empresas);
    }else if($tipoReq === 'POST'){
      $jsonDecode = json_decode($dados, true);
      $jsonDecode = $jsonDecode['User'];
      $insertDado = $conexaoBanco->prepare(
        'INSERT INTO coligadas  (nome, rua, cidade, estado, cnpjmf, statusinscricao, cep)
         VALUES                  (:nome, :rua, :cidade, :estado, :cnpjmf, :statusinscricao, :cep)');

      $insertDado->execute(array(
        ':nome'               => $jsonDecode['nome'],
        ':rua'                => $jsonDecode['rua'],
        ':cidade'             => $jsonDecode['cidade'],
        ':estado'             => $jsonDecode['estado'],
        ':cnpjmf'             => $jsonDecode['cnpjmf'],
        ':statusinscricao'    => $jsonDecode['statusinscricao'],
        ':cep'                => $jsonDecode['cep']
      ));
      if($insertDado->rowCount()){
        $idDado = $conexaoBanco->lastInsertId();
        echo json_encode( array( "status" => true, "message" => "Empresa coligada registrado com sucesso.", "id" => $idDado) );
      }else{
        echo json_encode( array( "status" => false, "message" => "Já existe essa empresa no banco de dados.") );
      }
    }

} catch (PDOException $e) {
    print "Error!: " . $e->getMessage() . "<br/>";
    die();
}
?>
