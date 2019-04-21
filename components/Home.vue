<template>
    <div id="app">
        <!--导航条-->
        <el-menu :default-active="activeIndex2" class="el-menu-demo" mode="horizontal" @select="handleSelect"
                 background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
            <el-menu-item index="1">处理中心</el-menu-item>
            <el-submenu index="2">
                <template slot="title">我的工作台</template>
                <el-menu-item index="2-1">选项1</el-menu-item>
                <el-menu-item index="2-2">选项2</el-menu-item>
                <el-menu-item index="2-3">选项3</el-menu-item>
            </el-submenu>
        </el-menu>
        <br>
        <!--搜索框-->
        <el-row>
            <el-col :span="1" class="grid">
                <el-button @click=register() type="success" icon="el-icon-search" size="mini">注册</el-button>
            </el-col>
        </el-row>
        <br>
        <!--表格数据及操作-->
        <el-table :data="tableData" border style="width: 100%" stripe ref="multipleTable" tooltip-effect="dark">
            <!--勾选框-->
            <el-table-column type="selection" width="55">
            </el-table-column>
            <!--索引-->
            <el-table-column type="index" :index="indexMethod">
            </el-table-column>
            <el-table-column prop="name" label="名称" width="180" sortable>
            </el-table-column>
            <el-table-column prop="price" label="价格" width="180">
            </el-table-column>
            <el-table-column prop="last_time" label="最后出价时间">
            </el-table-column>
            <el-table-column prop="is_bought" label="状态">
             </el-table-column>

            <el-table-column label="primary" width="100">
                <template slot-scope="scope">
                    <el-button @click=participate(scope.$index,scope.row) type="description" icon="el-icon-edit" size="mini">参与</el-button>
                </template>
            </el-table-column>
            <el-table-column label="danger" width="100">
                <template slot-scope="scope">
                 <el-input v-model="scope.row.buy" placeholder="请输入内容" size="mini"></el-input>
                    <el-button @click=pay(scope.$index,scope.row) type="danger" icon="el-icon-delete" size="mini">出价</el-button>
                    <el-button @click=transac(scope.$index,scope.row) type="danger" icon="el-icon-delete" size="mini">付款</el-button>
                </template>
            </el-table-column>
        </el-table>
        <br>
        <!--新增按钮-->
        <el-input v-model="sell" placeholder="最低报价" maxlength=10000 style="width:100px"></el-input>
        <el-input v-model="name" placeholder="商品名称" maxlength=10000 style="width:100px"></el-input>
        <el-col :span="10" >
            <el-button @click=display() type="sell" icon="el-icon-circle-plus-outline" size="mini" round>出售</el-button>
        </el-col>
        <!--全删按钮-->
        <el-col:span="1" class="grid">
        <el-button @click=finish() type="transaction" size="mini" round>交货与收款</el-button>
        </el-col>
        <br>
        <!--分页条-->
        <el-pagination background layout="prev, pager, next" :total="1000">
        </el-pagination>
    </div>
</template>
<script>
import GXClientFactory from "gxclient"
import Vue from 'vue';
import VueCookies from 'vue-cookies';
Vue.use(VueCookies);
let account_name_fake='hmmm123';
let private_key_fake='5KP7TdSYBoSAfoK4Kf5dsfCkGGovHzEMbycFLF7uiW6W73zt26c4';
var cookie=null
var contractName='auction8'
var broadcast=true;
var account_ID=null;
var sell_Itermid=null;
var credit=null;
var arrItem=new Array();
var examItem=new Array();
    export default {
            data() {
                return {
                    //表格数据
                    tableData: [{
                        price: 1232131,
                        name: '王小虎',
                        last_time: '上海市普陀区金沙江路 1518 弄',
                        is_bought:'已出售'
                        }, {
                            price: '2016-05-04',
                            name: '王小虎',
                            last_time: '上海市普陀区金沙江路 1517 弄',
                            is_bought:'已出售'
                            }, {
                                price: '2016-05-01',
                                name: '王小虎',
                                last_time: '上海市普陀区金沙江路 1519 弄',
                                is_bought:'已出售'
                                }, {
                                    price: '2016-05-03',
                                    name: '王小虎',
                                    last_time: '上海市普陀区金沙江路 1516 弄',
                                    is_bought:'已出售'
                                    },{price:3432532,
                                        name:'banana',
                                        last_time:'2019',
                                        is_bought:'已出售'
                                        }],
                                    //查询输入框数据
                                    input: '',
                                    //导航条默认选项
                                    activeIndex: '1',
                                    activeIndex2: '1',
                                    account:'',
                                    key:''

                                    }
                },
            created:function(){
                var router=this.$router;
                var broadcast=true;
                cookie=this.$cookies.get('User');
                sell_Itermid=this.$cookies.get('Sell');
                console.log(cookie);
                console.log(cookie.account_name);
                console.log(cookie.private_key);
                let client=GXClientFactory.instance({keyProvider:cookie.private_key,account:cookie.account_name,network:"wss://testnet.gxchain.org"});
                if(!client.connected)
                {
                    // router.push({path:'/',name:'Login'})

                    }
                client.getTableObjects("auction8", "pubiterm").then(result=>{console.log("result:",result)
                    for(var i=0;result[i]!=null;i++)
                    {
                        arrItem[i]=result[i]
                        examItem[i%5]=arrItem[i]

                        this.tableData[i%5].price=arrItem[i].final_price;

                        this.tableData[i%5].name=arrItem[i].name;

                        this.tableData[i%5].last_time=arrItem[i].last_pushtime;
                        this.tableData[i%5].itermid=arrItem[i].itermid;
                        if (arrItem[i].status==5){
                            this.tableData[i%5].is_bought='已出售'
                            }else{this.tableData[i%5].is_bought='未出售'}
                        }
                    client.getAccount(cookie.account_name).then(info=>{
                        console.log("acount's info",info);
                        account_ID=info.id;
                        });
                    console.log("arrItem:",arrItem);

                    client.getTableObjects("auction8","personlist").then(people=>{console.log("person",people)
                        var id_tmp=parseInt(account_ID.substr(4,4))
                        for(var i=0;people[i]!=null;i++)
                        {
                            if(id_tmp==people[i].personid)
                            {
                                credit=people[i].credit;
                                break;
                                }


                            }
                        })

                    })


                },
            methods: {
                    handleSelect(key, keyPath) {
                        console.log(key, keyPath);
                        },
                    indexMethod(index) {
                        return index;
                        },
                    getParams(){
                        var router_account=this.$route.params.account;
                        //this.account=router_account
                        alert(router_account);
                        },
                    register(){
                        let client=GXClientFactory.instance({keyProvider:cookie.private_key,account:cookie.account_name,network:"wss://testnet.gxchain.org"})
                        client.callContract(contractName,"signin",{},null,broadcast)


                        },



                    participate(index,row){
                        let client=GXClientFactory.instance({keyProvider:cookie.private_key,account:cookie.account_name,network:"wss://testnet.gxchain.org"});
                        console.log("test:",this.tableData[index].itermid,row.buy);
                        client.callContract(contractName,"joinrequest", {itermid:this.tableData[index].itermid}, null, broadcast)

                        },



                    display(){console.log("test23:",this.sell,this.name)
                        let client=GXClientFactory.instance({keyProvider:cookie.private_key,account:cookie.account_name,network:"wss://testnet.gxchain.org"});
                        console.log(cookie.private_key);
                        client.callContract(contractName,"verifyseller",{min_price:this.sell,name:this.name,discreption:"123123123"},null,true).then(seller=>{console.log("seller:",seller);
                        client.getTableObjects("auction8", "pubiterm").then(result=>{console.log("result:",result)

                        for(var i=0;result[i]!=null;i++){
                            if(result[i].name==this.name){
                                sell_Itermid=result[i].itermid;
                                console.log('sell_Itermid');
                                break;
                                }
                            this.$cookies.set('Sell',{sell_Itermid});
                            }//得到itermid
                        client.callContract(contractName,"paydeposit",{itermid:sell_Itermid},"1 GXC",broadcast)//支付押金
                       })
                        } )
                        },


                    transac(index,row){
                            var ItemList=new Array();
                            var ExamTable=new Array();

                    	 let client=GXClientFactory.instance({keyProvider:cookie.private_key,account:cookie.account_name,network:"wss://testnet.gxchain.org"});

			 client.getTableObjects("auction8", "pubiterm").then(result=>{console.log("result:",result)
                 for(var i=0;result[i]!=null;i++){
                     ItemList[i]=result[i]
                        ExamTable[i%5]=ItemList[i]

                     }
                 var money=(parseInt(ExamTable[index].final_price)/100000+0.01).toString()+" GXC"
                     console.log("money:",money)
                 client.callContract(contractName,"submitmoney",{itermid:ExamTable[index].itermid},((parseInt(ExamTable[index].final_price)/100000+0.01).toString()+' GXC'),true)

                 })

                        },




                    pay(index,row){
                        let client=GXClientFactory.instance({keyProvider:cookie.private_key,account:cookie.account_name,network:"wss://testnet.gxchain.org"});
                        console.log("test:",this.tableData[index].itermid,row.buy);
                        var deposit_num=(0.1*row.buy*(100-credit)/100+0.03).toString()+' GXC'
                        client.callContract(contractName, "newprice", {itermid:this.tableData[index].itermid,amount:row.buy},deposit_num, broadcast)
                        },



                    finish()
                    {

                        let client=GXClientFactory.instance({keyProvider:cookie.private_key,account:cookie.account_name,network:"wss://testnet.gxchain.org"});
                        client.callContract(contractName, "submitgood", {encrpted_goods:"ABCDEFG USTCBANZAI",itermid:sell_Itermid},null, broadcast)
                        client.callContract(contractName,'withdraw',{itermid:sell_Itermid},null,true)
                            }

                    }
            }
</script>
<style>
    #app {
        font-family: Helvetica, sans-serif;
        text-align: center;
    }
</style>
