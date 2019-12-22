import React from 'react';
import { StyleSheet, Text, View, Image, SafeAreaView, TouchableHighlight } from 'react-native';
import { CheckBox, Button } from 'react-native-elements';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable'
import  Dialog  from 'react-native-dialog';
import * as SQLite from 'expo-sqlite'
import RNPickerSelect from 'react-native-picker-select'


const db = SQLite.openDatabase("football.db")
class MyHeader extends React.Component {
  render(){
    return(
      <View style={styles.header}>
        <CheckBox
          title='Joueur'
          checked = {this.props.joueur}
          onPress={this.props.changeJoueur}
        />
        <CheckBox
          title='Espace'
          checked = {this.props.espace}
          onPress={this.props.changeEspace}
        />
        <Button
          title='Statistique'
          color='#fff'
          onPress={() => this.props.ctx.props.navigation.navigate('Statistique',{formationId:this.props.formationId,equipe:this.props.equipe,listJoueur:this.props.listJoueur})}
        />
        <Button
          title='Clear'
          color='#fff'
          onPress={this.props.clear}
        />
        <Button
          title='Start'
          color='#fff'
          onPress={this.props.start}
        />
      </View>
    )
  }
}
const renderRightActionsFormation = (title) => {
  return(
    <Button
      title='Delete'
      onPress={() => deleteFormation(title)}
    />
  )
}

const renderRightActionsEquipe = (title) => {
  return(
    <Button
      title='Delete'
      onPress={() => deleteEquipe(title)}
    />
  )
}

const deleteFormation = (title) => {
  db.transaction(tx => {
    tx.executeSql(
      "delete from formations where name = ?;",[title]);
  });  
}

const deleteEquipe = (title) => {
  db.transaction(tx => {
    tx.executeSql(
      "delete from equipes where name = ?;",[title]);
  });  
}

function Formation({title}) {
  return (
    <Swipeable
      renderRightActions={() => renderRightActionsFormation(title)}>
      <View style={styles.equipe}>
          <Text style={styles.textEquipe}>{title}</Text>
      </View>
    </Swipeable>
  );
}

function Equipe({title}) {
  return (
    <Swipeable
      renderRightActions={() => renderRightActionsEquipe(title)}>
      <View style={styles.equipe}>
          <Text style={styles.textEquipe}>{title}</Text>
      </View>
    </Swipeable>
  );
}

function Joueur() {
  return (
    <View>
      <Image
        style={{width: 50, height: 50}}
        source={require('./images/football.png')}
      />
    </View>
  );
}

class FormationScreen extends React.Component {
  state = {
    formations: [],
    dialogVisible: false,
    newFormation: "",
    countFormation: 0,
  }

  componentDidMount(){
    this.update();
  }

  showDialog = () => {
    this.setState({ dialogVisible: true });
  };
 
  handleAjout = text => {
    if (text != ""){
      this.setState({ dialogVisible: false, newFormation: "" })
      db.transaction(tx => {
        tx.executeSql("insert into formations (name) values (?)", [text]);
      }); 
      this.update()
    }
  };
 
  handleCancel = () => {
    this.setState({ dialogVisible: false });
  };
 
  update() {
    db.transaction(tx => {
      tx.executeSql(
        "select * from formations;",[],(tx,results) => {
          let e = []
          for (let i = 0; i<results.rows.length;i++){
            e.push({id:results.rows.item(i).id,name:results.rows.item(i).name})
          }
          this.setState({formations: e,countFormation: e.length})
        })
    });  
  }

  render(){
    return(
      <SafeAreaView>
        <FlatList 
          data={this.state.formations}
          keyExtractor={item => item.id.toString()}
          renderItem= {({item}) => <Formation title={item.name}/>}
        />
        <Button
          title='Ajouter Formation'
          color='#fff'
          onPress={() => {this.setState({dialogVisible: true})}}
        />
        <Dialog.Container visible={this.state.dialogVisible}>
          <Dialog.Title>Ajouter Formation</Dialog.Title>
          <Dialog.Description>Entrer le nom de la formation</Dialog.Description>
          <Dialog.Input onChangeText={(event) => this.setState({newFormation: event})}/>
          <Dialog.Button label="Ok" onPress={() => this.handleAjout(this.state.newFormation)} />
          <Dialog.Button label="Cancel" onPress={() => this.handleCancel()} />
        </Dialog.Container>

      </SafeAreaView>
    )
  }
}

class EquipeScreen extends React.Component {

  state = {
    equipes: [],
    dialogVisible: false,
    newEquipe: "",
    countEquipe: 0,
  }

  componentDidMount(){
    this.update();
  }

  showDialog = () => {
    this.setState({ dialogVisible: true });
  };
 
  handleAjout = text => {
    if (text != ""){
      this.setState({ dialogVisible: false, newEquipe: "" })
      db.transaction(tx => {
        tx.executeSql("insert into equipes (name) values (?)", [text]);
      }); 
      this.update()
    }
  };
 
  handleCancel = () => {
    this.setState({ dialogVisible: false });
  };
 
  update() {
    db.transaction(tx => {
      tx.executeSql(
        "select * from equipes;",[],(tx,results) => {
          let e = []
          for (let i = 0; i<results.rows.length;i++){
            e.push({id:results.rows.item(i).id,name:results.rows.item(i).name})
          }
          this.setState({equipes: e,countEquipe: e.length})
        })
    });  
  }

  render(){
    return(
      <SafeAreaView>
        <FlatList 
          data={this.state.equipes}
          renderItem= {({item}) => <Equipe title={item.name}/>}
          keyExtractor={item => item.id.toString()}
        />
        <Button
          title='Ajouter Equipe'
          color='#fff'
          onPress={() => {this.setState({dialogVisible: true})}}
        />
        <Dialog.Container visible={this.state.dialogVisible}>
          <Dialog.Title>Ajouter Equipe</Dialog.Title>
          <Dialog.Description>Entrer le nom de l'equipe</Dialog.Description>
          <Dialog.Input onChangeText={(event) => this.setState({newEquipe: event})}/>
          <Dialog.Button label="Ok" onPress={() => this.handleAjout(this.state.newEquipe)} />
          <Dialog.Button label="Cancel" onPress={() => this.handleCancel()} />
        </Dialog.Container>

      </SafeAreaView>
    )
  }
}

class StatistiqueScreen extends React.Component {

  essais = []
  joueurs = []
  espaces = []

  state = {
    score: [],
    listJoueur: this.props.navigation.getParam('listJoueur'),
    formation: "null",
    equipe: "null"
  }

  componentDidMount() {
    let formationId = JSON.stringify(this.props.navigation.getParam('formationId'))
    let equipeId = this.props.navigation.getParam('equipe')

    db.transaction(tx => {
      let formationName = ""
      let equipeName = ""
      tx.executeSql(
        "select * from formations where id=?;",[formationId],(tx,results) => {
          formationName = results.rows.item(0).name
          this.setState({formation:formationName})
        })
      tx.executeSql(
        "select * from equipes where id=?;",[equipeId],(tx,results) => {
          equipeName = results.rows.item(0).name
          this.setState({equipe:equipeName})
        })
    });  
    this.calcul(formationId,equipeId)
  }

  getEssais(idFormation,idEquipe){
    console.log(idFormation)
    console.log(idEquipe)
    db.transaction(tx => {
      tx.executeSql(
        "select * from essais where idFormation=? and idEquipe=?;",[idFormation,idEquipe],(tx,results) => {
          console.log(results.rows)
          for (let i = 0; i<results.rows.length;i++){
            this.essais.push(results.rows.item(i).id)
            console.log(this.essais)
          }
        })
    })
  }

  getJoueurs() {
    this.joueurs = []
    db.transaction(tx => {
    for (let i = 0; i < this.essais.length; i++){
      this.joueurs.push([])
        tx.executeSql(
          "select * from joueurs where idEssai=?;",[this.essais[i]],(tx,results) => {
            console.log(this.essais[i])
            console.log(results.rows)
            for (let j = 0; j<results.rows.length;j++){
              this.joueurs[i].push(results.rows.item(j).emplacement)
            }
          })
        }
      });
  }

  getEspaces() {
    this.espaces = []
    db.transaction(tx => {
    for (let i = 0; i < this.essais.length; i++){
      this.espaces.push([])
        tx.executeSql(
          "select * from espaces where idEssai=?;",[this.essais[i]],(tx,results) => {
            for (let j = 0; j<results.rows.length;j++){
              this.espaces[i].push(results.rows.item(j).emplacement)
            }
          })
        }
      });
  }

  calcul(formationId,equipeId) {
    this.getEssais(formationId,equipeId)
    this.getJoueurs()
    this.getEspaces()
    let itemPareil = 0
    let empScore = [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0] // 15 emplacements

    setTimeout(() => {
      console.log(this.essais)
      console.log(this.joueurs)
      console.log(this.espaces)
      for (let i = 0; i< this.essais.length;i++){
        itemPareil = 0
        for(j in this.joueurs[i]){
          for (let k = 0; k < this.state.listJoueur.length; k++){
            if (this.state.listJoueur[k].emplacement == this.joueurs[i][j]){
              itemPareil++
            }
          }
        }
        for (e in this.espaces[i]){
          empScore[this.espaces[i][e]-1] += Math.pow(itemPareil,2)
        }
      }
  
      let scoreTotal = 0
      for (let i = 0; i < empScore.length; i++){
        scoreTotal += empScore[i]
      }
      for (let i = 0; i < empScore.length; i++){
        empScore[i] = empScore[i] / scoreTotal
      }
      this.setState({score:empScore})
    }, 5000);
  }

  showScore(emp){
    return (
      <Text style={styles.score}>{this.state.score[emp-1] * 100}%</Text>
    )
  }

  render(){
    return(
      <View>
        <View>
          <View style={styles.range}> 
            <View style={styles.box1}>   
              {this.showScore('1')}
            </View>
            <View style={styles.box1}>
              {this.showScore('2')}
            </View>
          </View>
          <View style={styles.range}>
            <View style={styles.box2}>
              {this.showScore('3')}
            </View>
            <View style={styles.container}>
              <View style={styles.box3}>
                {this.showScore('4')}
              </View>
              <View style={styles.box3}>
                {this.showScore('5')}
              </View>
            </View>
            <View style={styles.box2}>
              {this.showScore('6')}
            </View>
          </View>
          <View style={styles.range}>
            <View style={styles.box4}>
              {this.showScore('7')}
            </View>
            <View style={styles.box4}>
              {this.showScore('8')}
            </View>
            <View style={styles.box4}>
              {this.showScore('9')}
            </View>
            <View style={styles.box4}>
              {this.showScore('10')}
            </View>
            <View style={styles.box4}>
              {this.showScore('11')}
            </View>
            <View style={styles.box4}>
              {this.showScore('12')}
            </View>
          </View>
          <View style={styles.range}>
            <View style={styles.box5}>
              {this.showScore('13')}
            </View>
            <View style={styles.box5}>
              {this.showScore('14')}
            </View>
            <View style={styles.box5}>
              {this.showScore('15')}
            </View>
          </View>
          <View style={styles.box6}>
            <View>
              <Text>Equipe Adverse : {this.state.equipe}</Text>
              <Text>Formation choisi : {this.state.formation}</Text>
            </View>
          </View>
        </View>
      </View>
    )
  }
}

class AcceuilScreen extends React.Component {

  state = {
    equipe: "",
    equipes: []
  }

  update() {
    db.transaction(tx => {
      tx.executeSql(
        "select * from equipes;",[],(tx,results) => {
          let e = []
          for (let i = 0; i<results.rows.length;i++){
            e.push({label:results.rows.item(i).name,value:results.rows.item(i).id})
          }
          this.setState({equipes: e})
      }) 
    }); 
  }

  startGame(ctx){
    if (this.state.equipe != ""){
      ctx.props.navigation.navigate('Home',{equipe: this.state.equipe})
    }
  }

  clearTable() {
    db.transaction(tx => {
      tx.executeSql("DROP TABLE equipes")
      tx.executeSql("DROP TABLE formations")
      tx.executeSql("DROP TABLE essais")
      tx.executeSql("DROP TABLE joueurs")
      tx.executeSql("DROP TABLE espaces")
      tx.executeSql(
        "create table if not exists equipes (id integer primary key AUTOINCREMENT, name text);")
      tx.executeSql(
        "create table if not exists formations (id integer primary key AUTOINCREMENT, name text);")
      tx.executeSql(
        "create table if not exists essais (id integer primary key AUTOINCREMENT, idEquipe integer not null, idFormation integer not null);")
      tx.executeSql(
        "create table if not exists joueurs (id integer primary key AUTOINCREMENT, idEssai integer, emplacement integer);")
      tx.executeSql(
        "create table if not exists espaces (id integer primary key AUTOINCREMENT, idEssai integer, emplacement integer);")
    });
  }

  render() {
    this.update()
    return(
      <View>
        <Text>Bienvenue</Text>
        <Button
          title='Equipe'
          color='#fff'
          onPress={() => this.props.navigation.navigate('Equipe')}
        />
        <Button
          title='Formations'
          color='#fff'
          onPress={() => this.props.navigation.navigate('Formation')}
        />
        <Text>Choisir une equipe :</Text>
        <RNPickerSelect
              onValueChange={(value) => this.setState({equipe: value})}
              items={this.state.equipes}
        />
        <Button
          title='Start!'
          color='#fff'
          onPress={() => this.startGame(this)}
        />
        <Button
          title='Clear Table!'
          color='#fff'
          onPress={() => this.clearTable()}
        />
      </View>
    )
  }
}

class HomeScreen extends React.Component {

  listJoueur = []
  listEspace = []
  state = {
    equipe: JSON.stringify(this.props.navigation.getParam('equipe')),
    formations: [],
    formationId: null,
    countJoueur:0,
    isJoueur:false,
    isEspace:false
  }

  static navigationOptions = {
    header: null,
    footer: null,
  }

  componentDidMount(){
    db.transaction(tx => {
      tx.executeSql(
        "select * from formations;",[],(tx,results) => {
          let e = []
          for (let i = 0; i<results.rows.length;i++){
            e.push({label:results.rows.item(i).name,value:results.rows.item(i).id})
          }
          this.setState({formations: e})
      }) 
    }); 
  }

  add(emp){
    if (this.state.isEspace) {
      this.listEspace.push(emp)
    }
    if (this.state.isJoueur){
      if (this.listJoueur.length < 12){
        this.setState({ countJoueur: this.state.countJoueur+1 })
        this.listJoueur.push({'id':String(this.state.countJoueur),'emplacement':emp})
      }
    }
  }

  showFlatList(emp){
    if (this.listEspace.includes(emp)){
      myStyle = styles.flatlistEspace
    }else {
      myStyle = styles.flatlist
    }
    return (
    <FlatList
      style={myStyle}
      contentContainerStyle={{display:'flex',flexDirection:'row',justifyContent:'space-evenly'}}
      data={this.listJoueur}
      renderItem= {({item}) => item.emplacement==emp?<Joueur/>:false}
      keyExtractor={item => item.id}
    />
    )
  }

  start() {
    let essai
     db.transaction(tx => {
      tx.executeSql("insert into essais (idEquipe,idFormation) values (?,?)", [this.state.equipe,this.state.formationId]);
      tx.executeSql(
        "SELECT last_insert_rowid() AS last",[],(tx,results) => {
        essai = results.rows.item(0).last
        console.log(results.rows)
        for (let i = 0; i < this.listJoueur.length; i++){
          console.log(essai)
          console.log(this.listJoueur[i].emplacement)
          tx.executeSql("insert into joueurs (idEssai,emplacement) values (?,?)", [essai,this.listJoueur[i].emplacement]);
        }
        for (let i = 0; i < this.listEspace.length; i++){
          console.log(essai)
          console.log(this.listEspace[i])
          tx.executeSql("insert into espaces (idEssai,emplacement) values (?,?)", [essai,this.listEspace[i]]);
        }
      })
    }); 
    // setTimeout(() => {
    //   this.clear()
    // }, 2000);
  }

  clear(){
    this.listEspace = []
    this.listJoueur = []
  }

  render(){
    return(
      <View>
        <MyHeader 
          ctx={this} 
          joueur={this.state.isJoueur} 
          espace={this.state.isEspace}
          changeJoueur={() => {this.setState({isJoueur: !this.state.isJoueur})}}
          changeEspace={() => {this.setState({isEspace:!this.state.isEspace})}}
          clear={() => this.clear()}
          start={() => this.start()}
          formationId={this.state.formationId}
          equipe={this.state.equipe}
          listJoueur={this.listJoueur}
          />
        <View>
          <View style={styles.range}> 
            <TouchableHighlight style={styles.box1} onPress={() => this.add('1')}>   
              {this.showFlatList('1')}
            </TouchableHighlight>
            <TouchableHighlight style={styles.box1} onPress={() => this.add('2')}>
              {this.showFlatList('2')}
            </TouchableHighlight>
          </View>
          <View style={styles.range}>
            <TouchableHighlight style={styles.box2} onPress={() => this.add('3')}>
              {this.showFlatList('3')}
            </TouchableHighlight>
            <View style={styles.container}>
              <TouchableHighlight style={styles.box3} onPress={() => this.add('4')}>
                {this.showFlatList('4')}
              </TouchableHighlight>
              <TouchableHighlight style={styles.box3} onPress={() => this.add('5')}>
                {this.showFlatList('5')}
              </TouchableHighlight>
            </View>
            <TouchableHighlight style={styles.box2} onPress={() => this.add('6')}>
              {this.showFlatList('6')}
            </TouchableHighlight>
          </View>
          <View style={styles.range}>
            <TouchableHighlight style={styles.box4} onPress={() => this.add('7')}>
              {this.showFlatList('7')}
            </TouchableHighlight>
            <TouchableHighlight style={styles.box4} onPress={() => this.add('8')}>
              {this.showFlatList('8')}
            </TouchableHighlight>
            <TouchableHighlight style={styles.box4} onPress={() => this.add('9')}>
              {this.showFlatList('9')}
            </TouchableHighlight>
            <TouchableHighlight style={styles.box4} onPress={() => this.add('10')}>
              {this.showFlatList('10')}
            </TouchableHighlight>
            <TouchableHighlight style={styles.box4} onPress={() => this.add('11')}>
              {this.showFlatList('11')}
            </TouchableHighlight>
            <TouchableHighlight style={styles.box4} onPress={() => this.add('12')}>
              {this.showFlatList('12')}
            </TouchableHighlight>
          </View>
          <View style={styles.range}>
            <TouchableHighlight style={styles.box5} onPress={() => this.add('13')}>
              {this.showFlatList('13')}
            </TouchableHighlight>
            <TouchableHighlight style={styles.box5} onPress={() => this.add('14')}>
              {this.showFlatList('14')}
            </TouchableHighlight>
            <TouchableHighlight style={styles.box5} onPress={() => this.add('15')}>
              {this.showFlatList('15')}
            </TouchableHighlight>
          </View>
          <View style={styles.box6}>
            <View style={styles.box7}>
              <Text>Selection d'une formation : </Text>
              <Text>Il reste {12 - this.listJoueur.length} joueurs a placer</Text>
            </View>
            <RNPickerSelect
              onValueChange={(value) => this.setState({formationId: value})}
              items={this.state.formations}
            />
          </View>
        </View>
      </View>
    )
  }
}

export default class App extends React.Component {

  componentDidMount() {
    db.transaction(tx => {
      tx.executeSql(
        "create table if not exists equipes (id integer primary key AUTOINCREMENT, name text);");
      tx.executeSql(
        "create table if not exists formations (id integer primary key AUTOINCREMENT, name text);");
      tx.executeSql(
        "create table if not exists essais (id integer primary key AUTOINCREMENT, idEquipe integer not null, idFormation integer not null);");
      tx.executeSql(
        "create table if not exists joueurs (id integer primary key AUTOINCREMENT, idEssai integer, emplacement integer);");
      tx.executeSql(
        "create table if not exists espaces (id integer primary key AUTOINCREMENT, idEssaie integer, emplacement integer);"); 
    });
  }

  render() {
    return (
      <AppContainer />
    );
  }
}

const RootStack = createStackNavigator (
  {
    Acceuil: AcceuilScreen,
    Home: HomeScreen,
    Equipe: EquipeScreen,
    Statistique: StatistiqueScreen,
    Formation: FormationScreen
  },
  {
    initalRoutName: 'Acceuil',
  }
)

const AppContainer = createAppContainer(RootStack)

const styles = StyleSheet.create({
  container: {
    display:'flex',
    flexDirection:'column',
    width:'33.3%',
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#aaa',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    height: '10%',
  },
  range: {
    display:'flex',
    flexDirection:'row',
  },
  box1: {
    borderColor: 'black',
    borderStyle: 'solid',
    borderWidth: 1,
    width:'50%',
    paddingBottom:'15%',
  },
  box2: {
    borderColor: 'black',
    borderStyle: 'solid',
    borderWidth: 1,
    width:'33.3%',
    paddingBottom:'15%',
  },
  box3: {
    borderColor: 'black',
    borderStyle: 'solid',
    borderWidth: 1,
    width:'100%',
    paddingBottom:'50%',
  },
  box4: {
    borderColor: 'black',
    borderStyle: 'solid',
    borderWidth: 1,
    width:'16.6%',
    paddingBottom:'30%',
  },
  box5: {
    borderColor: 'black',
    borderStyle: 'solid',
    borderWidth: 1,
    width:'33.3%',
    paddingBottom:'30%',
  },
  box6: {
    borderColor: 'black',
    borderStyle: 'solid',
    borderWidth: 1,
    width:'100%',
    paddingBottom:'45%',
  },
  box7: {
    display:'flex',
    flexDirection:'row',
    alignItems:'center',
    justifyContent:"space-between",
    marginTop:'1%',
    marginBottom:'2%'
  },
  equipe: {
    padding: '5%',
    backgroundColor: 'black',
    marginBottom:'2%',
  },
  textEquipe: {
    color: 'red',
    margin:'auto',
  },
  flatlist: {
    display:'flex',
    flexDirection:'row',
  },
  flatlistEspace: {
    display:'flex',
    flexDirection:'row',
    backgroundColor: 'red'
  },
  score: {
    fontSize: 32,
    textAlign: 'center',
  }
});
