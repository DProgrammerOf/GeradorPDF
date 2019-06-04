<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET,HEAD,OPTIONS,POST,PUT");
header("Access-Control-Allow-Headers: Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
include_once './config.php';

try {
    $conexaoBanco = new PDO('mysql:host='.$ServidorMysql.';dbname='.$BancoNome, $UsuarioMysql, $SenhaMysql);

    $tipoReq = $_SERVER['REQUEST_METHOD'];
    header('Content-type: application/json');
    $dados = file_get_contents('php://input');

    if($tipoReq === 'GET'){
      $jsonDecode = json_decode($_GET['User'], true);
      if($jsonDecode['tipo'] == "busca"){
        $colaboradores = array();
        foreach($conexaoBanco->query("SELECT * from empregados WHERE nome LIKE '%".$jsonDecode['nome']."%'") as $coluna) {
            array_push($colaboradores, array(
              'rg'            => $coluna['rg'],
              'nome'          => $coluna['nome'],
              'rua'           => $coluna['rua'],
              'cidade'        => $coluna['cidade'],
              'estado'        => $coluna['estado'],
              'bairro'        => $coluna['bairro'],
              'cpf'           => $coluna['cpf'],
              'status'        => $coluna['status'],
              'ctps'          => $coluna['ctps'],
              'nacionalidade' => $coluna['nacionalidade'],
              'pis'           => $coluna['pis']
            ));
        }
        $conexaoBanco = null;
        echo json_encode($colaboradores);
        return;
      }else if($jsonDecode['tipo'] == "select"){
        $getColaborador = $conexaoBanco->prepare("SELECT * from empregados WHERE rg = :rg LIMIT 1");
        $getColaborador->execute(
          array(':rg' => $jsonDecode['rg'])
        );
        $Colaborador = $getColaborador->fetch();

        //$colaboradores = array();
        $conexaoBanco = null;
          echo json_encode(array(
              'rg'            => $Colaborador['rg'],
              'nome'          => $Colaborador['nome'],
              'rua'           => $Colaborador['rua'],
              'cidade'        => $Colaborador['cidade'],
              'estado'        => $Colaborador['estado'],
              'bairro'        => $Colaborador['bairro'],
              'cpf'           => $Colaborador['cpf'],
              'status'        => $Colaborador['status'],
              'ctps'          => $Colaborador['ctps'],
              'nacionalidade' => $Colaborador['nacionalidade'],
              'pis'           => $Colaborador['pis']
            ));
      }

    }else if($tipoReq === 'POST'){
      $jsonDecode = json_decode($dados, true);
      $jsonDecode = $jsonDecode['User'];
      $insertDado = $conexaoBanco->prepare(
        'INSERT INTO empregados  (rg, nome, rua, cidade, estado, bairro, cpf, status, ctps, nacionalidade, pis)
         VALUES                  (:rg, :nome, :rua, :cidade, :estado, :bairro, :cpf, :statussocial, :ctps, :nacionalidade, :pis)');

      $insertDado->execute(array(
        ':rg'             => $jsonDecode['rg'],
        ':nome'           => $jsonDecode['nome'],
        ':rua'            => $jsonDecode['rua'],
        ':cidade'         => $jsonDecode['cidade'],
        ':estado'         => $jsonDecode['estado'],
        ':bairro'         => $jsonDecode['bairro'],
        ':cpf'            => $jsonDecode['cpf'],
        ':statussocial'   => $jsonDecode['statussocial'],
        ':ctps'           => $jsonDecode['ctps'],
        ':nacionalidade'  => $jsonDecode['nacionalidade'],
        ':pis'            => $jsonDecode['pis']
      ));
      if($insertDado->rowCount())
        echo json_encode( array( "status" => true, "message" => "Colaborador adicionado com sucesso.") );
      else
        echo json_encode( array( "status" => false, "message" => "Já existe esse RG registrado no banco de dados.") );
    }

} catch (PDOException $e) {
    echo json_encode( array( "status" => true, "message" => $e->getMessage()) );
    die();
}
?>
