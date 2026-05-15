import React, {
  useState,
  useCallback,
  useEffect,
  memo
} from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  FlatList,
  Alert
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  MaterialCommunityIcons,
  FontAwesome5
} from '@expo/vector-icons';

/* ======================================================
   ITENS MENU
====================================================== */

const itens = [

  {
    id: '1',
    nome: 'Óleo',
    icone: 'oil',
    biblioteca: 'MaterialCommunityIcons',
    cor: '#e67e22'
  },

  {
    id: '2',
    nome: 'Filtros',
    icone: 'air-filter',
    biblioteca: 'MaterialCommunityIcons',
    cor: '#27ae60'
  },

  {
    id: '3',
    nome: 'Alinhamento e Balanceamento',
    icone: 'car-cog',
    biblioteca: 'MaterialCommunityIcons',
    cor: '#2980b9'
  },

  {
    id: '4',
    nome: 'Pneus',
    icone: 'car-side',
    biblioteca: 'FontAwesome5',
    cor: '#c0392b'
  },

  {
    id: '5',
    nome: 'Bateria',
    icone: 'car-battery',
    biblioteca: 'FontAwesome5',
    cor: '#f1c40f'
  },

  {
    id: '6',
    nome: 'Correias',
    icone: 'engine',
    biblioteca: 'MaterialCommunityIcons',
    cor: '#9b59b6'
  }

];

/* ======================================================
   INPUT
====================================================== */

const TextInputField = memo(({
  value,
  setValue,
  placeholder
}) => {

  return (

    <TextInput
      value={value}
      onChangeText={setValue}
      placeholder={placeholder}
      keyboardType="numeric"
      style={styles.input}
    />

  );

});

/* ======================================================
   CARD HISTÓRICO
====================================================== */

const CardHistorico = memo(({ item, excluir }) => {

  return (

    <View style={styles.card}>

      <Text style={styles.cardTitulo}>
        {item.nome}
      </Text>

      <Text style={styles.cardTexto}>
        Data: {item.data}
      </Text>

      {/* ÓLEO */}
      {item.nome === 'Óleo' && (
        <>
          <Text style={styles.cardTexto}>
            KM Troca: {item.kmTroca}
          </Text>

          <Text style={styles.cardTexto}>
            Próxima Troca: {item.kmProxima}
          </Text>
        </>
      )}

      {/* FILTROS */}
      {item.nome === 'Filtros' && (
        <>
          <Text style={styles.cardTexto}>
            Filtro Óleo:
            {item.filtros.filtroOleo ? ' ✔' : ' ❌'}
          </Text>

          <Text style={styles.cardTexto}>
            Filtro Ar:
            {item.filtros.filtroAr ? ' ✔' : ' ❌'}
          </Text>

          <Text style={styles.cardTexto}>
            Ar Condicionado:
            {item.filtros.filtroArCondicionado ? ' ✔' : ' ❌'}
          </Text>
        </>
      )}

      {/* PNEUS */}
      {item.nome === 'Pneus' && (
        <>
          <Text style={styles.cardTexto}>
            DD: {item.pneus.dd ? '✔' : '❌'}
          </Text>

          <Text style={styles.cardTexto}>
            DE: {item.pneus.de ? '✔' : '❌'}
          </Text>

          <Text style={styles.cardTexto}>
            TD: {item.pneus.td ? '✔' : '❌'}
          </Text>

          <Text style={styles.cardTexto}>
            TE: {item.pneus.te ? '✔' : '❌'}
          </Text>
        </>
      )}

      {/* ALINHAMENTO */}
      {item.nome === 'Alinhamento e Balanceamento' && (
        <>
          <Text style={styles.cardTexto}>
            Alinhamento:
            {item.alinhamento ? ' ✔' : ' ❌'}
          </Text>

          <Text style={styles.cardTexto}>
            Balanceamento:
            {item.balanceamento ? ' ✔' : ' ❌'}
          </Text>

          <Text style={styles.cardTexto}>
            Rodízio:
            {' '}{item.rodizio}
          </Text>
        </>
      )}

      {/* BATERIA */}
      {item.nome === 'Bateria' && (
        <>
          <Text style={styles.cardTexto}>
            Trocada:
            {item.bateria.trocada ? ' ✔' : ' ❌'}
          </Text>

          <Text style={styles.cardTexto}>
            Voltagem:
            {' '}{item.bateria.volts}V
          </Text>
        </>
      )}

      {/* CORREIAS */}
      {item.nome === 'Correias' && (
        <>
          <Text style={styles.cardTexto}>
            Correia Dentada:
            {item.correias.dentada ? ' ✔' : ' ❌'}
          </Text>

          <Text style={styles.cardTexto}>
            Correia Alternador:
            {item.correias.alternador ? ' ✔' : ' ❌'}
          </Text>
        </>
      )}

      {/* EXCLUIR */}
      <TouchableOpacity
        style={styles.botaoExcluir}
        onPress={() => excluir(item.id)}
      >

        <Text style={styles.textoExcluir}>
          Excluir
        </Text>

      </TouchableOpacity>

    </View>

  );

});

/* ======================================================
   APP
====================================================== */

export default function App() {

  const [modalVisible, setModalVisible] = useState(false);

  const [itemSelecionado, setItemSelecionado] = useState(null);

  const [historico, setHistorico] = useState([]);

  // ÓLEO
  const [oleo, setOleo] = useState({
    kmTroca: '',
    kmProxima: ''
  });

  // FILTROS
  const [filtros, setFiltros] = useState({
    filtroOleo: false,
    filtroAr: false,
    filtroArCondicionado: false
  });

  // PNEUS
  const [pneus, setPneus] = useState({
    dd: false,
    de: false,
    td: false,
    te: false
  });

  // ALINHAMENTO
  const [alinhamento, setAlinhamento] = useState({
    alinhamento: false,
    balanceamento: false,
    rodizio: 'Nenhum'
  });

  // BATERIA
  const [bateria, setBateria] = useState({
    trocada: false,
    volts: ''
  });

  // CORREIAS
  const [correias, setCorreias] = useState({
    dentada: false,
    alternador: false
  });

  /* ======================================================
     CARREGAR DADOS
  ====================================================== */

  useEffect(() => {

    async function carregarDados() {

      try {

        const dados =
          await AsyncStorage.getItem('historico');

        if (dados) {
          setHistorico(JSON.parse(dados));
        }

      } catch (error) {

        console.log(error);

      }

    }

    carregarDados();

  }, []);

  /* ======================================================
     SALVAR STORAGE
  ====================================================== */

  useEffect(() => {

    async function salvarStorage() {

      try {

        await AsyncStorage.setItem(
          'historico',
          JSON.stringify(historico)
        );

      } catch (error) {

        console.log(error);

      }

    }

    salvarStorage();

  }, [historico]);

  /* ======================================================
     ABRIR ITEM
  ====================================================== */

  const abrirItem = useCallback((item) => {

    setItemSelecionado(item);

    setModalVisible(true);

  }, []);

  /* ======================================================
     LIMPAR
  ====================================================== */

  const limpar = useCallback(() => {

    setOleo({
      kmTroca: '',
      kmProxima: ''
    });

    setFiltros({
      filtroOleo: false,
      filtroAr: false,
      filtroArCondicionado: false
    });

    setPneus({
      dd: false,
      de: false,
      td: false,
      te: false
    });

    setAlinhamento({
      alinhamento: false,
      balanceamento: false,
      rodizio: 'Nenhum'
    });

    setBateria({
      trocada: false,
      volts: ''
    });

    setCorreias({
      dentada: false,
      alternador: false
    });

  }, []);

  /* ======================================================
     SALVAR
  ====================================================== */

  const salvar = useCallback(() => {

    if (!itemSelecionado) return;

    const data = new Date();

    const dataFormatada =
      data.getDate().toString().padStart(2, '0') + '/' +
      (data.getMonth() + 1).toString().padStart(2, '0') + '/' +
      data.getFullYear();

    let registro = {
      id: Date.now().toString(),
      nome: itemSelecionado.nome,
      data: dataFormatada
    };

    // ÓLEO
    if (itemSelecionado.nome === 'Óleo') {

      registro = {
        ...registro,
        kmTroca: oleo.kmTroca,
        kmProxima: oleo.kmProxima
      };
    }

    // FILTROS
    else if (itemSelecionado.nome === 'Filtros') {

      registro = {
        ...registro,
        filtros
      };
    }

    // PNEUS
    else if (itemSelecionado.nome === 'Pneus') {

      registro = {
        ...registro,
        pneus
      };
    }

    // ALINHAMENTO
    else if (
      itemSelecionado.nome ===
      'Alinhamento e Balanceamento'
    ) {

      registro = {
        ...registro,
        ...alinhamento
      };
    }

    // BATERIA
    else if (itemSelecionado.nome === 'Bateria') {

      registro = {
        ...registro,
        bateria
      };
    }

    // CORREIAS
    else if (itemSelecionado.nome === 'Correias') {

      registro = {
        ...registro,
        correias
      };
    }

    setHistorico((prev) => [registro, ...prev]);

    limpar();

    setModalVisible(false);

  }, [
    itemSelecionado,
    oleo,
    filtros,
    pneus,
    alinhamento,
    bateria,
    correias,
    limpar
  ]);

  /* ======================================================
     EXCLUIR
  ====================================================== */

  const excluir = useCallback((id) => {

    Alert.alert(
      'Excluir',
      'Deseja remover este registro?',
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },

        {
          text: 'Excluir',
          onPress: () => {

            setHistorico((prev) =>
              prev.filter((item) => item.id !== id)
            );

          }
        }
      ]
    );

  }, []);

  /* ======================================================
     ÍCONES
  ====================================================== */

  const renderIcon = useCallback((item) => {

    if (
      item.biblioteca ===
      'MaterialCommunityIcons'
    ) {

      return (
        <MaterialCommunityIcons
          name={item.icone}
          size={42}
          color={item.cor}
        />
      );
    }

    return (
      <FontAwesome5
        name={item.icone}
        size={38}
        color={item.cor}
      />
    );

  }, []);

  /* ======================================================
     RENDER
  ====================================================== */

  return (

    <View style={styles.container}>

      <Text style={styles.titulo}>
        Meu Carro 🚗
      </Text>

      {/* MENU */}
      <FlatList
        data={itens}
        numColumns={3}
        keyExtractor={(item) => item.id}
        removeClippedSubviews={true}
        initialNumToRender={6}
        renderItem={({ item }) => (

          <TouchableOpacity
            style={styles.item}
            onPress={() => abrirItem(item)}
          >

            <View style={styles.iconeBox}>
              {renderIcon(item)}
            </View>

            <Text style={styles.nome}>
              {item.nome}
            </Text>

          </TouchableOpacity>

        )}
      />

      {/* HISTÓRICO */}
      <FlatList
        data={historico}
        keyExtractor={(item) => item.id}
        removeClippedSubviews={true}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
        renderItem={({ item }) => (
          <CardHistorico
            item={item}
            excluir={excluir}
          />
        )}
      />

      {/* MODAL */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
      >

        <View style={styles.fundo}>

          <View style={styles.modal}>

            {itemSelecionado && (
              <>

                <Text style={styles.tituloModal}>
                  {itemSelecionado.nome}
                </Text>

                {/* ÓLEO */}
                {itemSelecionado.nome === 'Óleo' && (
                  <>

                    <Text style={styles.sub}>
                      KM Troca
                    </Text>

                    <TextInputField
                      value={oleo.kmTroca}
                      setValue={(text) =>
                        setOleo({
                          ...oleo,
                          kmTroca: text
                        })
                      }
                      placeholder="Ex: 50000"
                    />

                    <Text style={styles.sub}>
                      Próxima Troca
                    </Text>

                    <TextInputField
                      value={oleo.kmProxima}
                      setValue={(text) =>
                        setOleo({
                          ...oleo,
                          kmProxima: text
                        })
                      }
                      placeholder="Ex: 55000"
                    />

                  </>
                )}

                {/* FILTROS */}
                {itemSelecionado.nome === 'Filtros' && (
                  <>

                    <TouchableOpacity
                      onPress={() =>
                        setFiltros({
                          ...filtros,
                          filtroOleo:
                          !filtros.filtroOleo
                        })
                      }
                    >

                      <Text style={styles.check}>
                        Filtro Óleo
                        {filtros.filtroOleo ? ' ✔' : ''}
                      </Text>

                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() =>
                        setFiltros({
                          ...filtros,
                          filtroAr:
                          !filtros.filtroAr
                        })
                      }
                    >

                      <Text style={styles.check}>
                        Filtro Ar
                        {filtros.filtroAr ? ' ✔' : ''}
                      </Text>

                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() =>
                        setFiltros({
                          ...filtros,
                          filtroArCondicionado:
                          !filtros.filtroArCondicionado
                        })
                      }
                    >

                      <Text style={styles.check}>
                        Ar Condicionado
                        {filtros.filtroArCondicionado ? ' ✔' : ''}
                      </Text>

                    </TouchableOpacity>

                  </>
                )}

                {/* PNEUS */}
                {itemSelecionado.nome === 'Pneus' && (
                  <>

                    {[
                      ['dd', 'Dianteiro Direito'],
                      ['de', 'Dianteiro Esquerdo'],
                      ['td', 'Traseiro Direito'],
                      ['te', 'Traseiro Esquerdo']
                    ].map(([key, label]) => (

                      <TouchableOpacity
                        key={key}
                        onPress={() =>
                          setPneus({
                            ...pneus,
                            [key]: !pneus[key]
                          })
                        }
                      >

                        <Text style={styles.check}>
                          {label}
                          {pneus[key] ? ' ✔' : ''}
                        </Text>

                      </TouchableOpacity>

                    ))}

                  </>
                )}

                {/* ALINHAMENTO */}
                {itemSelecionado.nome === 'Alinhamento e Balanceamento' && (
                  <>

                    <TouchableOpacity
                      onPress={() =>
                        setAlinhamento({
                          ...alinhamento,
                          alinhamento:
                          !alinhamento.alinhamento
                        })
                      }
                    >

                      <Text style={styles.check}>
                        Alinhamento
                        {alinhamento.alinhamento ? ' ✔' : ''}
                      </Text>

                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() =>
                        setAlinhamento({
                          ...alinhamento,
                          balanceamento:
                          !alinhamento.balanceamento
                        })
                      }
                    >

                      <Text style={styles.check}>
                        Balanceamento
                        {alinhamento.balanceamento ? ' ✔' : ''}
                      </Text>

                    </TouchableOpacity>

                  </>
                )}

                {/* BATERIA */}
                {itemSelecionado.nome === 'Bateria' && (
                  <>

                    <TouchableOpacity
                      onPress={() =>
                        setBateria({
                          ...bateria,
                          trocada:
                          !bateria.trocada
                        })
                      }
                    >

                      <Text style={styles.check}>
                        Bateria Trocada
                        {bateria.trocada ? ' ✔' : ''}
                      </Text>

                    </TouchableOpacity>

                    <Text style={styles.sub}>
                      Voltagem
                    </Text>

                    <TextInputField
                      value={bateria.volts}
                      setValue={(text) =>
                        setBateria({
                          ...bateria,
                          volts: text
                        })
                      }
                      placeholder="Ex: 12.6"
                    />

                  </>
                )}

                {/* CORREIAS */}
                {itemSelecionado.nome === 'Correias' && (
                  <>

                    <TouchableOpacity
                      onPress={() =>
                        setCorreias({
                          ...correias,
                          dentada:
                          !correias.dentada
                        })
                      }
                    >

                      <Text style={styles.check}>
                        Correia Dentada
                        {correias.dentada ? ' ✔' : ''}
                      </Text>

                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() =>
                        setCorreias({
                          ...correias,
                          alternador:
                          !correias.alternador
                        })
                      }
                    >

                      <Text style={styles.check}>
                        Correia Alternador
                        {correias.alternador ? ' ✔' : ''}
                      </Text>

                    </TouchableOpacity>

                  </>
                )}

                {/* BOTÃO */}
                <TouchableOpacity
                  style={styles.botao}
                  onPress={salvar}
                >

                  <Text style={styles.textoBotao}>
                    Salvar
                  </Text>

                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() =>
                    setModalVisible(false)
                  }
                >

                  <Text style={styles.fechar}>
                    Fechar
                  </Text>

                </TouchableOpacity>

              </>
            )}

          </View>

        </View>

      </Modal>

    </View>

  );

}

/* ======================================================
   STYLES
====================================================== */

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 60,
    paddingHorizontal: 10
  },

  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 15
  },

  item: {
    flex: 1,
    alignItems: 'center',
    marginBottom: 25
  },

  iconeBox: {
    width: 90,
    height: 90,
    borderRadius: 25,
    backgroundColor: '#f5f6fa',
    justifyContent: 'center',
    alignItems: 'center'
  },

  nome: {
    marginTop: 8,
    color: '#333',
    textAlign: 'center'
  },

  fundo: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center'
  },

  modal: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20
  },

  tituloModal: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10
  },

  sub: {
    marginTop: 10,
    marginBottom: 5,
    fontWeight: 'bold'
  },

  check: {
    padding: 8,
    fontSize: 16
  },

  botao: {
    marginTop: 15,
    backgroundColor: '#00b894',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center'
  },

  textoBotao: {
    color: '#fff',
    fontWeight: 'bold'
  },

  fechar: {
    textAlign: 'center',
    marginTop: 10,
    color: '#888'
  },

  card: {
    backgroundColor: '#f5f6fa',
    padding: 15,
    borderRadius: 15,
    marginBottom: 10
  },

  cardTitulo: {
    fontSize: 18,
    fontWeight: 'bold'
  },

  cardTexto: {
    color: '#555',
    marginTop: 3
  },

  input: {
    backgroundColor: '#f1f2f6',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    color: '#333'
  },

  botaoExcluir: {
    marginTop: 10,
    backgroundColor: '#e74c3c',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center'
  },

  textoExcluir: {
    color: '#fff',
    fontWeight: 'bold'
  }

});