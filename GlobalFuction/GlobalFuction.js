import GLOBALS from '../UtilityClass/Globals';


export function liveRateItemCalculationTerminal (curentItem,PrevItem,GroupDetail,ObjGroup,isSource,isSourceNext) {

  try {
      let InTotal =0;
      let OneClick =0;
      var dropGrame=[];
      let Step = 0;

      let lv = curentItem;
     
      if (lv == '') {
        return;
      }
      let IDSymbol = lv.SymbolId;
      let Sname = lv.Symbol;
      let Bid = lv.Bid;
      let Ask = lv.Ask;
      let High = lv.High;
      let Low = lv.Low;
      let Source = lv.Source.toLocaleLowerCase();
      let Time = lv.Time;
      let IsDisplayTerminal = lv.IsDisplayTerminal.toLocaleLowerCase();
      let Premium = lv.Premium;
      let Diff = lv.Diff;
      let Difference = lv.Difference

      if (IsDisplayTerminal == 'false') {
        return;
      }

      let lvlocal = PrevItem;

      // if (Source == isSource || Source == isSourceNext) {
      
    
      var BGColorBid;
      var textColorBid = GLOBALS.COLOR.TEXT_COLOR;
      var BGColorAsk;
      var textColorAsk = GLOBALS.COLOR.TEXT_COLOR;

      if (lvlocal != undefined) {

        let lvs = lvlocal;
        let Bidlocal = lvs.Bid;
        let Asklocal = lvs.Ask;
        

        let BidStatus = StatusUpDownColor(Bidlocal,Bid);
        BGColorBid = BidStatus.BGColor;
        textColorBid = BidStatus.textColor;

        let AskStatus = StatusUpDownColor(Asklocal,Ask);
        BGColorAsk = AskStatus.BGColor;
        textColorAsk = AskStatus.textColor;
      }
      if (GroupDetail.length > 0 && GroupDetail[0].Status == true) {
          if (Source.toLocaleLowerCase() == "gold" || Source.toLocaleLowerCase() == "goldnext") {
              Bid = parseFloat(Bid) + GroupDetail[0].GoldBuyPremium;
              Ask = parseFloat(Ask) + GroupDetail[0].GoldSellPremium;

              Low = parseFloat(Low) + GroupDetail[0].GoldSellPremium;
              High = parseFloat(High) + GroupDetail[0].GoldSellPremium;
              
          } else {
              Bid = parseFloat(Bid) + GroupDetail[0].SilverBuyPremium;
              Ask = parseFloat(Ask) + GroupDetail[0].SilverSellPremium;

              Low = parseFloat(Low) + GroupDetail[0].SilverSellPremium;
              High = parseFloat(High) + GroupDetail[0].SilverSellPremium;
          }

                var ObjSymbole;
                if (ObjGroup.length > 0) {
                  ObjGroupSymbol = (id) => {
                    return ObjGroup.find(data => data.SymbolID == id);
                  };
                  ObjSymbole = ObjGroupSymbol(parseInt(IDSymbol));
                  if (ObjSymbole != undefined) {
                    Bid = parseFloat(Bid) + parseFloat(ObjSymbole.BuyPremium);
                    Ask = parseFloat(Ask) + parseFloat(ObjSymbole.SellPremium);
        
                    Low = parseFloat(Low) + parseFloat(ObjSymbole.SellPremium);
                    High = parseFloat(High) + parseFloat(ObjSymbole.SellPremium);

                    if (InTotal != ObjSymbole.InTotal || OneClick != ObjSymbole.OneClick) {
        
                        InTotal = ObjSymbole.InTotal;
                        OneClick = ObjSymbole.OneClick;
                        Step = ObjSymbole.Step;
                        dropGrame = []; 
                        if (Step <= 0 ){
                          Step = OneClick;
                        }
                        if (InTotal != undefined && OneClick != undefined && InTotal != 0 && OneClick != 0 && OneClick != 0 && Step != 0 && Step != undefined)  {
                          
                            let grameKg="";
                            if (Source.toLocaleLowerCase() == "gold" || Source.toLocaleLowerCase() == "goldnext") {
                                grameKg="gm";
                            } else {
                                grameKg='kg';
                            }
                            
                            for (let index = OneClick; index <= InTotal; index) {
                                var objGram = index  +' '+ grameKg;
                                dropGrame.push(objGram);
                                index = index + Step;
                            }
                            
                        }
                    }
                  } else {
                    return;
                  }
                
                }
        
                if(Number.isNaN(Bid)){
                  Bid='--';
                }
                if(Number.isNaN(Ask)){
                  Ask='--';
                }
      
                if(Number.isNaN(Low)){
                  Low='--';
                }
                if(Number.isNaN(High)){
                  High='--';
                }
                    
        
              const strItem = JSON.stringify({
                  IDSymbol:IDSymbol,
                  Sname:Sname,
                  Bid:Bid,
                  Ask:Ask,
                  High:High,
                  Low:Low,
                  Source:Source,
                  Time:Time,
                  IsDisplayTerminal:IsDisplayTerminal,
                  GramAndKG:dropGrame,
                  BGColorBid:BGColorBid,
                  textColorBid:textColorBid,
                  BGColorAsk:BGColorAsk,
                  textColorAsk:textColorAsk,
                  Premium:Premium,
                  Diff:Diff,
                  Difference:Difference,
              });
              return JSON.parse(strItem);
              
            } else {
              return;
            }
      // } else {
      //   return;
      // }
      

       
  } catch (error) {
    console.log(error)
  }
    
  };
  export function liveRateItemCalculationTerminalAllSymbol (CurentItem,PrevItem,GroupDetail,ObjGroup) {

   return CurentItem.map((item) => {
     
  
    try {
        let InTotal =0;
        let OneClick =0;
        var dropGrame=[];
  
        let lv = item;
       
        if (lv == '') {
          return;
        }
        let IDSymbol = lv.SymbolId;
        let Sname = lv.Symbol;
        let Bid = lv.Bid;
        let Ask = lv.Ask;
        let High = lv.High;
        let Low = lv.Low;
        let Source = lv.Source.toLocaleLowerCase();
        let Time = lv.Time;
        let IsDisplayTerminal = lv.IsDisplayTerminal.toLocaleLowerCase()
  
        // if (IsDisplayTerminal == 'false') {
        //   return;
        // }
  
        let lvlocal = PrevItem;
  
        
        
      
        var BGColorBid;
        var textColorBid = GLOBALS.COLOR.TEXT_COLOR;
        var BGColorAsk;
        var textColorAsk = GLOBALS.COLOR.TEXT_COLOR;
  
        if (lvlocal != undefined) {
  
          let lvs = lvlocal;
          let Bidlocal = lvs.Bid;
          let Asklocal = lvs.Ask;
          
  
          let BidStatus = StatusUpDownColor(Bidlocal,Bid);
          BGColorBid = BidStatus.BGColor;
          textColorBid = BidStatus.textColor;
  
          let AskStatus = StatusUpDownColor(Asklocal,Ask);
          BGColorAsk = AskStatus.BGColor;
          textColorAsk = AskStatus.textColor;
        }
        if (GroupDetail.length > 0) {
            if (Source.toLocaleLowerCase() == "gold" || Source.toLocaleLowerCase() == "goldnext") {
                Bid = parseFloat(Bid) + GroupDetail[0].GoldBuyPremium;
                Ask = parseFloat(Ask) + GroupDetail[0].GoldSellPremium;
            } else {
                Bid = parseFloat(Bid) + GroupDetail[0].SilverBuyPremium;
                Ask = parseFloat(Ask) + GroupDetail[0].SilverSellPremium;
            }
  
                  var ObjSymbole;
                  if (ObjGroup.length > 0) {
                    ObjGroupSymbol = (id) => {
                      return ObjGroup.find(data => data.SymbolID == id);
                    };
                    ObjSymbole = ObjGroupSymbol(parseInt(IDSymbol));
                    if (ObjSymbole != undefined) {
                      Bid = parseFloat(Bid) + parseFloat(ObjSymbole.BuyPremium);
                      Ask = parseFloat(Ask) + parseFloat(ObjSymbole.SellPremium);
          
          
                      if (InTotal != ObjSymbole.InTotal || OneClick != ObjSymbole.OneClick) {
          
                          InTotal = ObjSymbole.InTotal;
                          OneClick = ObjSymbole.OneClick;
                          dropGrame = []; 
                          if (InTotal != undefined && OneClick != undefined && InTotal != 0 && OneClick != 0)  {
                            
                              let grameKg="";
                              if (Source.toLocaleLowerCase() == "gold" || Source.toLocaleLowerCase() == "goldnext") {
                                  grameKg="gm";
                              } else {
                                  grameKg='kg';
                              }
                              
                              for (let index = OneClick; index <= InTotal; index) {
                                  var objGram = index  +' '+ grameKg;
                                  dropGrame.push(objGram);
                                  index = index + OneClick;
                              }
                              
                          }
                      }
                    } else {
                      return;
                    }
                  
                  }
          
                  if(Number.isNaN(Bid)){
                    Bid='--';
                  }
                  if(Number.isNaN(Ask)){
                    Ask='--';
                  }
                      
          
                const strItem = JSON.stringify({
                    IDSymbol:IDSymbol,
                    Sname:Sname,
                    Bid:Bid,
                    Ask:Ask,
                    High:High,
                    Low:Low,
                    Source:Source,
                    Time:Time,
                    IsDisplayTerminal:IsDisplayTerminal,
                    GramAndKG:dropGrame,
                    BGColorBid:BGColorBid,
                    textColorBid:textColorBid,
                    BGColorAsk:BGColorAsk,
                    textColorAsk:textColorAsk,
                });
                return JSON.parse(strItem);
                //allSymbol.push(JSON.parse(strItem));
                
              } else {
                return;
              }
       
        
          
         
    } catch (error) {
      console.log(error)
    }

    return allSymbol;
  })
      
};
  
  export function liveRateItemCalculationBullion (curentItem,PrevItem,isSource,isSourceNext) {

    try {
      let lv = curentItem;
      if (lv == '') {
        return;
      }
      let IDSymbol = lv.SymbolId;
      let Sname = lv.Symbol;
      let Bid = lv.Bid;
      let Ask = lv.Ask;
      let High = lv.High;
      let Low = lv.Low;
      let Source = lv.Source.toLocaleLowerCase();
      let Time = lv.Time;
      let IsDisplayBullion = lv.IsDisplay.toLocaleLowerCase()
      let Premium = lv.Premium;
      let Diff = lv.Diff;
      let Difference = lv.Difference;
      if (IsDisplayBullion == 'false') {
        return;
      }
      // if (Source == isSource || Source == isSourceNext) {
           
      let lvlocal = PrevItem;
    
      var BGColorBid;
      var textColorBid = GLOBALS.COLOR.TEXT_COLOR;
      var BGColorAsk;
      var textColorAsk = GLOBALS.COLOR.TEXT_COLOR;

      if (lvlocal != undefined) {

        let lvs = lvlocal;
        let Bidlocal = lvs.Bid;
        let Asklocal = lvs.Ask;
        

        let BidStatus = StatusUpDownColor(Bidlocal,Bid);
        BGColorBid = BidStatus.BGColor;
        textColorBid = BidStatus.textColor;

        let AskStatus = StatusUpDownColor(Asklocal,Ask);
        BGColorAsk = AskStatus.BGColor;
        textColorAsk = AskStatus.textColor;
      }
      if(Number.isNaN(Bid)){
        Bid='--';
      }
      if(Number.isNaN(Ask)){
        Ask='--';
      }
      const strItem = JSON.stringify({
          IDSymbol:IDSymbol,
          Sname:Sname,
          Bid:Bid,
          Ask:Ask,
          High:High,
          Low:Low,
          Source:Source,
          Time:Time,
          IsDisplayFront:IsDisplayBullion,
          BGColorBid:BGColorBid,
          textColorBid:textColorBid,
          BGColorAsk:BGColorAsk,
          textColorAsk:textColorAsk,
          Premium:Premium,
          Diff:Diff,
          Difference:Difference,
      });
        return JSON.parse(strItem);
      // } else {
      //   return;
      // }
    } catch (error) {
      console.log(error);
    }

    
  };


  ///Status UpDowun ---->
function StatusUpDownColor(strPre, strCur) {
 
    var BGColor;
    var textColor;
    var PreValue = parseFloat(strPre);
    var CurValue = parseFloat(strCur);
  
    try {
      if (PreValue < CurValue) {
        BGColor = GLOBALS.COLOR.RATE_UP;
        textColor = GLOBALS.COLOR.WHITE;
      } else if (PreValue > CurValue) {
        BGColor = GLOBALS.COLOR.RATE_DOWN;
        textColor = GLOBALS.COLOR.WHITE;
      } else {
        BGColor = GLOBALS.COLOR.TRANSPARENT_COLOR;
        textColor = GLOBALS.COLOR.BLACK;
      }
    } catch (e) {
      BGColor = GLOBALS.COLOR.TRANSPARENT_COLOR;
      textColor = GLOBALS.COLOR.BLACK;
    }
    const strColor = JSON.stringify({BGColor:BGColor,textColor:textColor});
    return JSON.parse(strColor);
  }