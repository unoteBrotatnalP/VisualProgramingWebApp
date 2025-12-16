/*
// jesli chodzi o dodawanie nowych zadan, oprocz oczywiscie wymysleniu tresci, to tak:
// przechodzimy na strone https://blockly-demo.appspot.com/static/demos/code/index.html
// układamy bloki, a pozniej klikamy na xml
// tego xmla kopiujemy i daje do expectedXml w zadaniu 
// nastepnie gdy mamy bledy, czyli ` w kodzie, to urchamiamy skrypt fix-xml-backticks.js
// (nalezy to zrobic przed kazdym dodawaniem nowego zadania)
// (jezeli nie ma bledow, to nie trzeba go uruchamiac)
*/




export const zadania = {
  // ========== ZMIENNE (5 zadań) ==========
  zmienne_1: {
    kategoria: "zmienne",
    tytul: "Zmienne 1: Moja ulubiona gra",
    opis: "Stwórz zmienną o nazwie 'zmienna' i zapisz w niej nazwę 'Minecraft'. Następnie wypisz wartość tej zmiennej w konsoli.",
    expectedXml: `<xml xmlns="https://developers.google.com/blockly/xml">
  <variables>
    <variable id="{o5*yXEDkB8k2g[RK#Xl">zmienna</variable>
  </variables>
  <block type="variables_set" id="Mg;tm#iT6eWa{Z_}R{3y" x="10" y="10">
    <field name="VAR" id="{o5*yXEDkB8k2g[RK#Xl">zmienna</field>
    <value name="VALUE">
      <block type="text" id="v$G@4UT$a=G|{?D*F)X#">
        <field name="TEXT">Minecraft</field>
      </block>
    </value>
    <next>
      <block type="text_print" id="aiC]:V#7B+t6(U(i#^#5">
        <value name="TEXT">
          <block type="variables_get" id="%3H;3F5z5Ii*MI%oNpHQ">
            <field name="VAR" id="{o5*yXEDkB8k2g[RK#Xl">zmienna</field>
          </block>
        </value>
      </block>
    </next>
  </block>
</xml>`,
  },
  zmienne_2: {
    kategoria: "zmienne",
    tytul: "Zmienne 2: Ile mam lat?",
    opis: "Stwórz zmienną o nazwie 'zmienna' i ustaw ją na 10. Następnie wypisz tekst 'Mam 10 lat!' używając bloku 'połącz', aby połączyć tekst 'Mam ' z wartością zmiennej i tekstem ' lat!'.",
    expectedXml: `<xml xmlns="https://developers.google.com/blockly/xml">
  <variables>
    <variable id="{E-z9)AxC{mxN9-(=fxa">zmienna</variable>
  </variables>
  <block type="variables_set" id="-bVk:BzRjC6GAXY4lZ:U" x="10" y="10">
    <field name="VAR" id="{E-z9)AxC{mxN9-(=fxa">zmienna</field>
    <value name="VALUE">
      <block type="math_number" id="PEd/?N7SlImGvdMY-Zy">
        <field name="NUM">10</field>
      </block>
    </value>
    <next>
      <block type="text_print" id="RG7I*S^LEjThtbqmNN5m">
        <value name="TEXT">
          <block type="text_join" id="}P)S9eD]2|0bKz8^0}sD">
            <mutation items="3"></mutation>
            <value name="ADD0">
              <block type="text" id="PH?LjK_bDKDoQ,Zw(f8*">
                <field name="TEXT">Mam </field>
              </block>
            </value>
            <value name="ADD1">
              <block type="variables_get" id="tr]9:TFUx5%_o*ntnr6J">
                <field name="VAR" id="{E-z9)AxC{mxN9-(=fxa">zmienna</field>
              </block>
            </value>
            <value name="ADD2">
              <block type="text" id="-Vn,9^gd@t+^us}gc/s@">
                <field name="TEXT"> lat!</field>
              </block>
            </value>
          </block>
        </value>
      </block>
    </next>
  </block>
</xml>`,
  },
  zmienne_3: {
    kategoria: "zmienne",
    tytul: "Zmienne 3: Licznik punktów",
    opis: "Stwórz zmienną o nazwie 'zmienna' i ustaw ją na 0. Następnie użyj bloku 'zmień ... o', aby zwiększyć ją o 100 i wypisz nową wartość.",
    expectedXml: `<xml xmlns="https://developers.google.com/blockly/xml">
  <variables>
    <variable id="var1">zmienna</variable>
  </variables>
  <block type="variables_set" id="block1" x="10" y="10">
    <field name="VAR" id="var1">zmienna</field>
    <value name="VALUE">
      <block type="math_number" id="block2">
        <field name="NUM">0</field>
      </block>
    </value>
    <next>
      <block type="math_change" id="block3">
        <field name="VAR" id="var1">zmienna</field>
        <value name="DELTA">
          <block type="math_number" id="block4">
            <field name="NUM">100</field>
          </block>
        </value>
        <next>
          <block type="text_print" id="block5">
            <value name="TEXT">
              <block type="variables_get" id="block6">
                <field name="VAR" id="var1">zmienna</field>
              </block>
            </value>
          </block>
        </next>
      </block>
    </next>
  </block>
</xml>`,
  },
  zmienne_4: {
    kategoria: "zmienne",
    tytul: "Zmienne 4: Moje dane",
    opis: "Stwórz dwie zmienne: pierwszą o nazwie 'zmienna1' ustaw na tekst 'Ola', drugą o nazwie 'zmienna2' ustaw na tekst 'Warszawa'. Wypisz tekst 'Nazywam się Ola i mieszkam w Warszawie' używając bloku 'połącz' z wartościami tych zmiennych.",
    expectedXml: `<xml xmlns="https://developers.google.com/blockly/xml">
  <variables>
    <variable id="var1">zmienna1</variable>
    <variable id="var2">zmienna2</variable>
  </variables>
  <block type="variables_set" id="block1" x="10" y="10">
    <field name="VAR" id="var1">zmienna1</field>
    <value name="VALUE">
      <block type="text" id="block2">
        <field name="TEXT">Ola</field>
      </block>
    </value>
    <next>
      <block type="variables_set" id="block3">
        <field name="VAR" id="var2">zmienna2</field>
        <value name="VALUE">
          <block type="text" id="block4">
            <field name="TEXT">Warszawa</field>
          </block>
        </value>
        <next>
          <block type="text_print" id="block5">
            <value name="TEXT">
              <block type="text_join" id="block6">
                <mutation items="4"></mutation>
                <value name="ADD0">
                  <block type="text" id="block7">
                    <field name="TEXT">Nazywam się </field>
                  </block>
                </value>
                <value name="ADD1">
                  <block type="variables_get" id="block8">
                    <field name="VAR" id="var1">zmienna1</field>
                  </block>
                </value>
                <value name="ADD2">
                  <block type="text" id="block9">
                    <field name="TEXT"> i mieszkam w </field>
                  </block>
                </value>
                <value name="ADD3">
                  <block type="variables_get" id="block10">
                    <field name="VAR" id="var2">zmienna2</field>
                  </block>
                </value>
              </block>
            </value>
          </block>
        </next>
      </block>
    </next>
  </block>
</xml>`,
  },
  zmienne_5: {
    kategoria: "zmienne",
    tytul: "Zmienne 5: Obliczenia ze zmiennymi",
    opis: "Stwórz trzy zmienne: pierwszą o nazwie 'zmienna1' ustaw na 7, drugą o nazwie 'zmienna2' ustaw na 5. Dodaj je do siebie i wynik zapisz w trzeciej zmiennej o nazwie 'zmienna3', a następnie wypisz wartość tej trzeciej zmiennej.",
    expectedXml: `<xml xmlns="https://developers.google.com/blockly/xml">
  <variables>
    <variable id="var1">zmienna1</variable>
    <variable id="var2">zmienna2</variable>
    <variable id="var3">zmienna3</variable>
  </variables>
  <block type="variables_set" id="block1" x="10" y="10">
    <field name="VAR" id="var1">zmienna1</field>
    <value name="VALUE">
      <block type="math_number" id="block2">
        <field name="NUM">7</field>
      </block>
    </value>
    <next>
      <block type="variables_set" id="block3">
        <field name="VAR" id="var2">zmienna2</field>
        <value name="VALUE">
          <block type="math_number" id="block4">
            <field name="NUM">5</field>
          </block>
        </value>
        <next>
          <block type="variables_set" id="block5">
            <field name="VAR" id="var3">zmienna3</field>
            <value name="VALUE">
              <block type="math_arithmetic" id="block6">
                <field name="OP">ADD</field>
                <value name="A">
                  <block type="variables_get" id="block7">
                    <field name="VAR" id="var1">zmienna1</field>
                  </block>
                </value>
                <value name="B">
                  <block type="variables_get" id="block8">
                    <field name="VAR" id="var2">zmienna2</field>
                  </block>
                </value>
              </block>
            </value>
            <next>
              <block type="text_print" id="block9">
                <value name="TEXT">
                  <block type="variables_get" id="block10">
                    <field name="VAR" id="var3">zmienna3</field>
                  </block>
                </value>
              </block>
            </next>
          </block>
        </next>
      </block>
    </next>
  </block>
</xml>`,
  },

  // ========== PĘTLE (5 zadań) ==========
  petle_1: {
    kategoria: "petle",
    tytul: "Pętle 1: Powitanie 5 razy",
    opis: "Użyj pętli 'powtórz', aby wypisać słowo 'Cześć!' 5 razy. Każde powitanie w nowej linii.",
    expectedXml: `<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="controls_repeat_ext" id="block1" x="10" y="10">
    <value name="TIMES">
      <block type="math_number" id="block2">
        <field name="NUM">5</field>
      </block>
    </value>
    <statement name="DO">
      <block type="text_print" id="block3">
        <value name="TEXT">
          <block type="text" id="block4">
            <field name="TEXT">Cześć!</field>
          </block>
        </value>
      </block>
    </statement>
  </block>
</xml>`,
  },
  petle_2: {
    kategoria: "petle",
    tytul: "Pętle 2: Liczenie do 10",
    opis: "Użyj pętli FOR, aby wypisać liczby od 1 do 10. W pętli FOR użyj zmiennej licznika i wypisz jej wartość w każdej iteracji.",
    expectedXml: `<xml xmlns="https://developers.google.com/blockly/xml">
  <variables>
    <variable id="var1">i</variable>
  </variables>
  <block type="controls_for" id="block1" x="10" y="10">
    <field name="VAR" id="var1">i</field>
    <value name="FROM">
      <block type="math_number" id="block2">
        <field name="NUM">1</field>
      </block>
    </value>
    <value name="TO">
      <block type="math_number" id="block3">
        <field name="NUM">10</field>
      </block>
    </value>
    <value name="BY">
      <block type="math_number" id="block4">
        <field name="NUM">1</field>
      </block>
    </value>
    <statement name="DO">
      <block type="text_print" id="block5">
        <value name="TEXT">
          <block type="variables_get" id="block6">
            <field name="VAR" id="var1">i</field>
          </block>
        </value>
      </block>
    </statement>
  </block>
</xml>`,
  },
  petle_3: {
    kategoria: "petle",
    tytul: "Pętle 3: Liczby podzielne przez 3",
    opis: "Użyj pętli FOR, aby wypisać liczby podzielne przez 3 od 3 do 15 (3, 6, 9, 12, 15). Ustaw krok pętli na 3.",
    expectedXml: `<xml xmlns="https://developers.google.com/blockly/xml">
  <variables>
    <variable id="var1">i</variable>
  </variables>
  <block type="controls_for" id="block1" x="10" y="10">
    <field name="VAR" id="var1">i</field>
    <value name="FROM">
      <block type="math_number" id="block2">
        <field name="NUM">3</field>
      </block>
    </value>
    <value name="TO">
      <block type="math_number" id="block3">
        <field name="NUM">15</field>
      </block>
    </value>
    <value name="BY">
      <block type="math_number" id="block4">
        <field name="NUM">3</field>
      </block>
    </value>
    <statement name="DO">
      <block type="text_print" id="block5">
        <value name="TEXT">
          <block type="variables_get" id="block6">
            <field name="VAR" id="var1">i</field>
          </block>
        </value>
      </block>
    </statement>
  </block>
</xml>`,
  },
  petle_4: {
    kategoria: "petle",
    tytul: "Pętle 4: Odliczanie",
    opis: "Użyj pętli WHILE, aby wypisać liczby od 5 do 1 (odliczanie wstecz). Stwórz zmienną o nazwie 'zmienna' i ustaw ją na 5, a następnie zmniejszaj ją w pętli, dopóki jest większa od 0.",
    expectedXml: `<xml xmlns="https://developers.google.com/blockly/xml">
  <variables>
    <variable id="var1">zmienna</variable>
  </variables>
  <block type="variables_set" id="block1" x="10" y="10">
    <field name="VAR" id="var1">zmienna</field>
    <value name="VALUE">
      <block type="math_number" id="block2">
        <field name="NUM">5</field>
      </block>
    </value>
    <next>
      <block type="controls_whileUntil" id="block3">
        <field name="MODE">WHILE</field>
        <value name="BOOL">
          <block type="logic_compare" id="block4">
            <field name="OP">GT</field>
            <value name="A">
              <block type="variables_get" id="block5">
                <field name="VAR" id="var1">zmienna</field>
              </block>
            </value>
            <value name="B">
              <block type="math_number" id="block6">
                <field name="NUM">0</field>
              </block>
            </value>
          </block>
        </value>
        <statement name="DO">
          <block type="text_print" id="block7">
            <value name="TEXT">
              <block type="variables_get" id="block8">
                <field name="VAR" id="var1">zmienna</field>
              </block>
            </value>
          </block>
          <next>
            <block type="variables_set" id="block9">
              <field name="VAR" id="var1">zmienna</field>
              <value name="VALUE">
                <block type="math_arithmetic" id="block10">
                  <field name="OP">MINUS</field>
                  <value name="A">
                    <block type="variables_get" id="block11">
                      <field name="VAR" id="var1">zmienna</field>
                    </block>
                  </value>
                  <value name="B">
                    <block type="math_number" id="block12">
                      <field name="NUM">1</field>
                    </block>
                  </value>
                </block>
              </value>
            </block>
          </next>
        </statement>
      </block>
    </next>
  </block>
</xml>`,
  },
  petle_5: {
    kategoria: "petle",
    tytul: "Pętle 5: Gwiazdki",
    opis: "Użyj pętli 'powtórz', aby wypisać 8 gwiazdek w jednej linii: ********. Stwórz zmienną o nazwie 'zmienna' i ustaw ją na pusty tekst (''). W pętli używaj bloku 'połącz', aby łączyć gwiazdki do tej zmiennej.",
    expectedXml: `<xml xmlns="https://developers.google.com/blockly/xml">
  <variables>
    <variable id="var1">zmienna</variable>
  </variables>
  <block type="variables_set" id="block1" x="10" y="10">
    <field name="VAR" id="var1">zmienna</field>
    <value name="VALUE">
      <block type="text" id="block2">
        <field name="TEXT"></field>
      </block>
    </value>
    <next>
      <block type="controls_repeat_ext" id="block3">
        <value name="TIMES">
          <block type="math_number" id="block4">
            <field name="NUM">8</field>
          </block>
        </value>
        <statement name="DO">
          <block type="variables_set" id="block5">
            <field name="VAR" id="var1">zmienna</field>
            <value name="VALUE">
              <block type="text_join" id="block6">
                <mutation items="2"></mutation>
                <value name="ADD0">
                  <block type="variables_get" id="block7">
                    <field name="VAR" id="var1">zmienna</field>
                  </block>
                </value>
                <value name="ADD1">
                  <block type="text" id="block8">
                    <field name="TEXT">*</field>
                  </block>
                </value>
              </block>
            </value>
          </block>
        </statement>
        <next>
          <block type="text_print" id="block9">
            <value name="TEXT">
              <block type="variables_get" id="block10">
                <field name="VAR" id="var1">zmienna</field>
              </block>
            </value>
          </block>
        </next>
      </block>
    </next>
  </block>
</xml>`,
  },

  // ========== WARUNKI (5 zadań) ==========
  warunki_1: {
    kategoria: "warunki",
    tytul: "Warunki 1: Parzysta czy nieparzysta?",
    opis: "Sprawdź, czy liczba 9 jest parzysta (czy reszta z dzielenia przez 2 równa się 0). Jeśli tak, wypisz 'parzysta', jeśli nie, wypisz 'nieparzysta'.",
    expectedXml: `<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="controls_if" id="block1" x="10" y="10">
    <mutation else="1"></mutation>
    <value name="IF0">
      <block type="logic_compare" id="block2">
        <field name="OP">EQ</field>
        <value name="A">
          <block type="math_modulo" id="block3">
            <value name="DIVIDEND">
              <block type="math_number" id="block4">
                <field name="NUM">9</field>
              </block>
            </value>
            <value name="DIVISOR">
              <block type="math_number" id="block5">
                <field name="NUM">2</field>
              </block>
            </value>
          </block>
        </value>
        <value name="B">
          <block type="math_number" id="block6">
            <field name="NUM">0</field>
          </block>
        </value>
      </block>
    </value>
    <statement name="DO0">
      <block type="text_print" id="block7">
        <value name="TEXT">
          <block type="text" id="block8">
            <field name="TEXT">parzysta</field>
          </block>
        </value>
      </block>
    </statement>
    <statement name="ELSE">
      <block type="text_print" id="block9">
        <value name="TEXT">
          <block type="text" id="block10">
            <field name="TEXT">nieparzysta</field>
          </block>
        </value>
      </block>
    </statement>
  </block>
</xml>`,
  },
  warunki_2: {
    kategoria: "warunki",
    tytul: "Warunki 2: Czy mogę iść do kina?",
    opis: "Masz 25 zł, a bilet do kina kosztuje 20 zł. Sprawdź, czy 25 jest większe od 20. Jeśli tak, wypisz 'Mogę iść do kina!', w przeciwnym razie wypisz 'Muszę oszczędzać'.",
    expectedXml: `<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="controls_if" id="block1" x="10" y="10">
    <mutation else="1"></mutation>
    <value name="IF0">
      <block type="logic_compare" id="block2">
        <field name="OP">GT</field>
        <value name="A">
          <block type="math_number" id="block3">
            <field name="NUM">25</field>
          </block>
        </value>
        <value name="B">
          <block type="math_number" id="block4">
            <field name="NUM">20</field>
          </block>
        </value>
      </block>
    </value>
    <statement name="DO0">
      <block type="text_print" id="block5">
        <value name="TEXT">
          <block type="text" id="block6">
            <field name="TEXT">Mogę iść do kina!</field>
          </block>
        </value>
      </block>
    </statement>
    <statement name="ELSE">
      <block type="text_print" id="block7">
        <value name="TEXT">
          <block type="text" id="block8">
            <field name="TEXT">Muszę oszczędzać</field>
          </block>
        </value>
      </block>
    </statement>
  </block>
</xml>`,
  },
  warunki_3: {
    kategoria: "warunki",
    tytul: "Warunki 3: Właściwa temperatura",
    opis: "Sprawdź, czy temperatura 22 stopnie jest większa od 15 I mniejsza od 30. Jeśli oba warunki są spełnione, wypisz 'Idealna temperatura!', w przeciwnym razie wypisz 'Za zimno lub za gorąco'.",
    expectedXml: `<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="controls_if" id="block1" x="10" y="10">
    <mutation else="1"></mutation>
    <value name="IF0">
      <block type="logic_operation" id="block2">
        <field name="OP">AND</field>
        <value name="A">
          <block type="logic_compare" id="block3">
            <field name="OP">GT</field>
            <value name="A">
              <block type="math_number" id="block4">
                <field name="NUM">22</field>
              </block>
            </value>
            <value name="B">
              <block type="math_number" id="block5">
                <field name="NUM">15</field>
              </block>
            </value>
          </block>
        </value>
        <value name="B">
          <block type="logic_compare" id="block6">
            <field name="OP">LT</field>
            <value name="A">
              <block type="math_number" id="block7">
                <field name="NUM">22</field>
              </block>
            </value>
            <value name="B">
              <block type="math_number" id="block8">
                <field name="NUM">30</field>
              </block>
            </value>
          </block>
        </value>
      </block>
    </value>
    <statement name="DO0">
      <block type="text_print" id="block9">
        <value name="TEXT">
          <block type="text" id="block10">
            <field name="TEXT">Idealna temperatura!</field>
          </block>
        </value>
      </block>
    </statement>
    <statement name="ELSE">
      <block type="text_print" id="block11">
        <value name="TEXT">
          <block type="text" id="block12">
            <field name="TEXT">Za zimno lub za gorąco</field>
          </block>
        </value>
      </block>
    </statement>
  </block>
</xml>`,
  },
  warunki_4: {
    kategoria: "warunki",
    tytul: "Warunki 4: Która liczba większa?",
    opis: "Stwórz dwie zmienne: pierwszą o nazwie 'zmienna1' ustaw na 13, drugą o nazwie 'zmienna2' ustaw na 12. Sprawdź, czy pierwsza zmienna jest większa lub równa drugiej zmiennej. Jeśli tak, wypisz 'Możesz wejść', w przeciwnym razie wypisz 'Jesteś za młody'.",
    expectedXml: `<xml xmlns="https://developers.google.com/blockly/xml">
  <variables>
    <variable id="var1">zmienna1</variable>
    <variable id="var2">zmienna2</variable>
  </variables>
  <block type="variables_set" id="block1" x="10" y="10">
    <field name="VAR" id="var1">zmienna1</field>
    <value name="VALUE">
      <block type="math_number" id="block2">
        <field name="NUM">13</field>
      </block>
    </value>
    <next>
      <block type="variables_set" id="block3">
        <field name="VAR" id="var2">zmienna2</field>
        <value name="VALUE">
          <block type="math_number" id="block4">
            <field name="NUM">12</field>
          </block>
        </value>
        <next>
          <block type="controls_if" id="block5">
            <mutation else="1"></mutation>
            <value name="IF0">
              <block type="logic_compare" id="block6">
                <field name="OP">GTE</field>
                <value name="A">
                  <block type="variables_get" id="block7">
                    <field name="VAR" id="var1">zmienna1</field>
                  </block>
                </value>
                <value name="B">
                  <block type="variables_get" id="block8">
                    <field name="VAR" id="var2">zmienna2</field>
                  </block>
                </value>
              </block>
            </value>
            <statement name="DO0">
              <block type="text_print" id="block9">
                <value name="TEXT">
                  <block type="text" id="block10">
                    <field name="TEXT">Możesz wejść</field>
                  </block>
                </value>
              </block>
            </statement>
            <statement name="ELSE">
              <block type="text_print" id="block11">
                <value name="TEXT">
                  <block type="text" id="block12">
                    <field name="TEXT">Jesteś za młody</field>
                  </block>
                </value>
              </block>
            </statement>
          </block>
        </next>
      </block>
    </next>
  </block>
</xml>`,
  },

  // ========== TEKST (4 zadania) ==========
  tekst_1: {
    kategoria: "tekst",
    tytul: "Tekst 1: Moje ulubione zwierzę",
    opis: "Wypisz nazwę 'Pies' w konsoli używając bloku 'wypisz'.",
    expectedXml: `<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="text_print" id="block1" x="10" y="10">
    <value name="TEXT">
      <block type="text" id="block2">
        <field name="TEXT">Pies</field>
      </block>
    </value>
  </block>
</xml>`,
  },
  tekst_2: {
    kategoria: "tekst",
    tytul: "Tekst 2: Powitanie",
    opis: "Użyj bloku 'połącz', aby połączyć słowa 'Cześć' i '! Jestem programistą.' (zauważ spację!) i wypisz wynik.",
    expectedXml: `<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="text_print" id="block1" x="10" y="10">
    <value name="TEXT">
      <block type="text_join" id="block2">
        <mutation items="2"></mutation>
        <value name="ADD0">
          <block type="text" id="block3">
            <field name="TEXT">Cześć</field>
          </block>
        </value>
        <value name="ADD1">
          <block type="text" id="block4">
            <field name="TEXT">! Jestem programistą.</field>
          </block>
        </value>
      </block>
    </value>
  </block>
</xml>`,
  },
  tekst_3: {
    kategoria: "tekst",
    tytul: "Tekst 3: Zdanie z trzech części",
    opis: "Użyj bloku 'połącz', aby połączyć trzy części: 'Dzisiaj', ' jest' i ' piękny dzień!' (zauważ spacje!). Wypisz wynik.",
    expectedXml: `<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="text_print" id="block1" x="10" y="10">
    <value name="TEXT">
      <block type="text_join" id="block2">
        <mutation items="3"></mutation>
        <value name="ADD0">
          <block type="text" id="block3">
            <field name="TEXT">Dzisiaj</field>
          </block>
        </value>
        <value name="ADD1">
          <block type="text" id="block4">
            <field name="TEXT"> jest</field>
          </block>
        </value>
        <value name="ADD2">
          <block type="text" id="block5">
            <field name="TEXT"> piękny dzień!</field>
          </block>
        </value>
      </block>
    </value>
  </block>
</xml>`,
  },
  tekst_4: {
    kategoria: "tekst",
    tytul: "Tekst 4: Długie zdanie",
    opis: "Użyj bloku 'połącz', aby połączyć cztery części: 'Programowanie', ' to', ' super' i ' zabawa!' (zauważ spacje!). Wypisz wynik.",
    expectedXml: `<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="text_print" id="block1" x="10" y="10">
    <value name="TEXT">
      <block type="text_join" id="block2">
        <mutation items="4"></mutation>
        <value name="ADD0">
          <block type="text" id="block3">
            <field name="TEXT">Programowanie</field>
          </block>
        </value>
        <value name="ADD1">
          <block type="text" id="block4">
            <field name="TEXT"> to</field>
          </block>
        </value>
        <value name="ADD2">
          <block type="text" id="block5">
            <field name="TEXT"> super</field>
          </block>
        </value>
        <value name="ADD3">
          <block type="text" id="block6">
            <field name="TEXT"> zabawa!</field>
          </block>
        </value>
      </block>
    </value>
  </block>
</xml>`,
  },
  tekst_5: {
    kategoria: "tekst",
    tytul: "Tekst 5: Ile liter ma słowo?",
    opis: "Użyj bloku 'długość', aby sprawdzić ile liter ma słowo 'Krokodyl'. Wypisz wynik.",
    expectedXml: `<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="text_print" id="block1" x="10" y="10">
    <value name="TEXT">
      <block type="text_length" id="block2">
        <value name="VALUE">
          <block type="text" id="block3">
            <field name="TEXT">Krokodyl</field>
          </block>
        </value>
      </block>
    </value>
  </block>
</xml>`,
  },
  tekst_6: {
    kategoria: "tekst",
    tytul: "Tekst 6: Wielkie litery",
    opis: "Użyj bloku 'zmiana wielkości liter', aby zmienić tekst 'cicho sza' na wielkie litery i wypisz wynik.",
    expectedXml: `<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="text_print" id="block1" x="10" y="10">
    <value name="TEXT">
      <block type="text_changeCase" id="block2">
        <field name="CASE">UPPERCASE</field>
        <value name="TEXT">
          <block type="text" id="block3">
            <field name="TEXT">cicho sza</field>
          </block>
        </value>
      </block>
    </value>
  </block>
</xml>`,
  },

  // ========== MATEMATYCZNE (5 zadań) ==========
  matematyczne_1: {
    kategoria: "matematyczne",
    tytul: "Matematyczne 1: Reszta z dzielenia",
    opis: "Dzielisz 17 cukierków między 5 przyjaciół. Oblicz ile cukierków zostanie (reszta z dzielenia 17 przez 5) używając bloku modulo i wypisz wynik.",
    expectedXml: `<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="text_print" id="block1" x="10" y="10">
    <value name="TEXT">
      <block type="math_modulo" id="block2">
        <value name="DIVIDEND">
          <block type="math_number" id="block3">
            <field name="NUM">17</field>
          </block>
        </value>
        <value name="DIVISOR">
          <block type="math_number" id="block4">
            <field name="NUM">5</field>
          </block>
        </value>
      </block>
    </value>
  </block>
</xml>`,
  },
  matematyczne_2: {
    kategoria: "matematyczne",
    tytul: "Matematyczne 2: Obliczenia ze zmiennymi",
    opis: "Stwórz trzy zmienne: pierwszą o nazwie 'zmienna1' ustaw na 20, drugą o nazwie 'zmienna2' ustaw na 3. Oblicz ile zapłacisz (pierwsza * druga) i wynik zapisz w trzeciej zmiennej o nazwie 'zmienna3', a następnie wypisz wartość tej trzeciej zmiennej.",
    expectedXml: `<xml xmlns="https://developers.google.com/blockly/xml">
  <variables>
    <variable id="var1">zmienna1</variable>
    <variable id="var2">zmienna2</variable>
    <variable id="var3">zmienna3</variable>
  </variables>
  <block type="variables_set" id="block1" x="10" y="10">
    <field name="VAR" id="var1">zmienna1</field>
    <value name="VALUE">
      <block type="math_number" id="block2">
        <field name="NUM">20</field>
      </block>
    </value>
    <next>
      <block type="variables_set" id="block3">
        <field name="VAR" id="var2">zmienna2</field>
        <value name="VALUE">
          <block type="math_number" id="block4">
            <field name="NUM">3</field>
          </block>
        </value>
        <next>
          <block type="variables_set" id="block5">
            <field name="VAR" id="var3">zmienna3</field>
            <value name="VALUE">
              <block type="math_arithmetic" id="block6">
                <field name="OP">MULTIPLY</field>
                <value name="A">
                  <block type="variables_get" id="block7">
                    <field name="VAR" id="var1">zmienna1</field>
                  </block>
                </value>
                <value name="B">
                  <block type="variables_get" id="block8">
                    <field name="VAR" id="var2">zmienna2</field>
                  </block>
                </value>
              </block>
            </value>
            <next>
              <block type="text_print" id="block9">
                <value name="TEXT">
                  <block type="variables_get" id="block10">
                    <field name="VAR" id="var3">zmienna3</field>
                  </block>
                </value>
              </block>
            </next>
          </block>
        </next>
      </block>
    </next>
  </block>
</xml>`,
  },
  matematyczne_3: {
    kategoria: "matematyczne",
    tytul: "Matematyczne 3: Zaokrąglanie",
    opis: "Zaokrąglij liczbę 3.7 do najbliższej liczby całkowitej używając bloku 'zaokrąglij' i wypisz wynik.",
    expectedXml: `<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="text_print" id="block1" x="10" y="10">
    <value name="TEXT">
      <block type="math_round" id="block2">
        <field name="OP">ROUND</field>
        <value name="NUM">
          <block type="math_number" id="block3">
            <field name="NUM">3.7</field>
          </block>
        </value>
      </block>
    </value>
  </block>
</xml>`,
  },
  matematyczne_4: {
    kategoria: "matematyczne",
    tytul: "Matematyczne 4: Rzut kostką",
    opis: "Użyj bloku 'losowa liczba', aby wylosować liczbę od 1 do 6 (jak rzut kostką) i wypisz wynik. (Uwaga: wynik może być różny za każdym razem, ale powinien być w zakresie 1-6)",
    expectedXml: `<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="text_print" id="block1" x="10" y="10">
    <value name="TEXT">
      <block type="math_random_int" id="block2">
        <value name="FROM">
          <block type="math_number" id="block3">
            <field name="NUM">1</field>
          </block>
        </value>
        <value name="TO">
          <block type="math_number" id="block4">
            <field name="NUM">6</field>
          </block>
        </value>
      </block>
    </value>
  </block>
</xml>`,
  },

  // ========== KOMBINOWANE (5 zadań) ==========
  kombinowane_1: {
    kategoria: "kombinowane",
    tytul: "Kombinowane 1: Parzyste liczby w pętli",
    opis: "Użyj pętli FOR od 1 do 10. W każdej iteracji sprawdź, czy licznik jest parzysty (reszta z dzielenia przez 2 = 0). Jeśli tak, wypisz licznik.",
    expectedXml: `<xml xmlns="https://developers.google.com/blockly/xml">
  <variables>
    <variable id="var1">i</variable>
  </variables>
  <block type="controls_for" id="block1" x="10" y="10">
    <field name="VAR" id="var1">i</field>
    <value name="FROM">
      <block type="math_number" id="block2">
        <field name="NUM">1</field>
      </block>
    </value>
    <value name="TO">
      <block type="math_number" id="block3">
        <field name="NUM">10</field>
      </block>
    </value>
    <value name="BY">
      <block type="math_number" id="block4">
        <field name="NUM">1</field>
      </block>
    </value>
    <statement name="DO">
      <block type="controls_if" id="block5">
        <value name="IF0">
          <block type="logic_compare" id="block6">
            <field name="OP">EQ</field>
            <value name="A">
              <block type="math_modulo" id="block7">
                <value name="DIVIDEND">
                  <block type="variables_get" id="block8">
                    <field name="VAR" id="var1">i</field>
                  </block>
                </value>
                <value name="DIVISOR">
                  <block type="math_number" id="block9">
                    <field name="NUM">2</field>
                  </block>
                </value>
              </block>
            </value>
            <value name="B">
              <block type="math_number" id="block10">
                <field name="NUM">0</field>
              </block>
            </value>
          </block>
        </value>
        <statement name="DO0">
          <block type="text_print" id="block11">
            <value name="TEXT">
              <block type="variables_get" id="block12">
                <field name="VAR" id="var1">i</field>
              </block>
            </value>
          </block>
        </statement>
      </block>
    </statement>
  </block>
</xml>`,
  },
  kombinowane_2: {
    kategoria: "kombinowane",
    tytul: "Kombinowane 2: Suma w pętli",
    opis: "Stwórz zmienną o nazwie 'zmienna' i ustaw ją na 0. Użyj pętli FOR od 1 do 5. W każdej iteracji dodaj licznik do tej zmiennej. Na końcu wypisz tekst 'Suma wynosi: ' połączony z wartością tej zmiennej.",
    expectedXml: `<xml xmlns="https://developers.google.com/blockly/xml">
  <variables>
    <variable id="var1">zmienna</variable>
    <variable id="var2">i</variable>
  </variables>
  <block type="variables_set" id="block1" x="10" y="10">
    <field name="VAR" id="var1">zmienna</field>
    <value name="VALUE">
      <block type="math_number" id="block2">
        <field name="NUM">0</field>
      </block>
    </value>
    <next>
      <block type="controls_for" id="block3">
        <field name="VAR" id="var2">i</field>
        <value name="FROM">
          <block type="math_number" id="block4">
            <field name="NUM">1</field>
          </block>
        </value>
        <value name="TO">
          <block type="math_number" id="block5">
            <field name="NUM">5</field>
          </block>
        </value>
        <value name="BY">
          <block type="math_number" id="block6">
            <field name="NUM">1</field>
          </block>
        </value>
        <statement name="DO">
          <block type="variables_set" id="block7">
            <field name="VAR" id="var1">zmienna</field>
            <value name="VALUE">
              <block type="math_arithmetic" id="block8">
                <field name="OP">ADD</field>
                <value name="A">
                  <block type="variables_get" id="block9">
                    <field name="VAR" id="var1">zmienna</field>
                  </block>
                </value>
                <value name="B">
                  <block type="variables_get" id="block10">
                    <field name="VAR" id="var2">i</field>
                  </block>
                </value>
              </block>
            </value>
          </block>
        </statement>
        <next>
          <block type="text_print" id="block11">
            <value name="TEXT">
              <block type="text_join" id="block12">
                <mutation items="2"></mutation>
                <value name="ADD0">
                  <block type="text" id="block13">
                    <field name="TEXT">Suma wynosi: </field>
                  </block>
                </value>
                <value name="ADD1">
                  <block type="variables_get" id="block14">
                    <field name="VAR" id="var1">zmienna</field>
                  </block>
                </value>
              </block>
            </value>
          </block>
        </next>
      </block>
    </next>
  </block>
</xml>`,
  },
  kombinowane_3: {
    kategoria: "kombinowane",
    tytul: "Kombinowane 3: Warunek z obliczeniami",
    opis: "Stwórz trzy zmienne: pierwszą o nazwie 'zmienna1' ustaw na 50, drugą o nazwie 'zmienna2' ustaw na 10. Oblicz różnicę (pierwsza - druga) i zapisz w trzeciej zmiennej o nazwie 'zmienna3'. Sprawdź, czy trzecia zmienna jest mniejsza od 45. Jeśli tak, wypisz 'Tania!', w przeciwnym razie wypisz 'Droga'.",
    expectedXml: `<xml xmlns="https://developers.google.com/blockly/xml">
  <variables>
    <variable id="var1">zmienna1</variable>
    <variable id="var2">zmienna2</variable>
    <variable id="var3">zmienna3</variable>
  </variables>
  <block type="variables_set" id="block1" x="10" y="10">
    <field name="VAR" id="var1">zmienna1</field>
    <value name="VALUE">
      <block type="math_number" id="block2">
        <field name="NUM">50</field>
      </block>
    </value>
    <next>
      <block type="variables_set" id="block3">
        <field name="VAR" id="var2">zmienna2</field>
        <value name="VALUE">
          <block type="math_number" id="block4">
            <field name="NUM">10</field>
          </block>
        </value>
        <next>
          <block type="variables_set" id="block5">
            <field name="VAR" id="var3">zmienna3</field>
            <value name="VALUE">
              <block type="math_arithmetic" id="block6">
                <field name="OP">MINUS</field>
                <value name="A">
                  <block type="variables_get" id="block7">
                    <field name="VAR" id="var1">zmienna1</field>
                  </block>
                </value>
                <value name="B">
                  <block type="variables_get" id="block8">
                    <field name="VAR" id="var2">zmienna2</field>
                  </block>
                </value>
              </block>
            </value>
            <next>
              <block type="controls_if" id="block9">
                <mutation else="1"></mutation>
                <value name="IF0">
                  <block type="logic_compare" id="block10">
                    <field name="OP">LT</field>
                    <value name="A">
                      <block type="variables_get" id="block11">
                        <field name="VAR" id="var3">zmienna3</field>
                      </block>
                    </value>
                    <value name="B">
                      <block type="math_number" id="block12">
                        <field name="NUM">45</field>
                      </block>
                    </value>
                  </block>
                </value>
                <statement name="DO0">
                  <block type="text_print" id="block13">
                    <value name="TEXT">
                      <block type="text" id="block14">
                        <field name="TEXT">Tania!</field>
                      </block>
                    </value>
                  </block>
                </statement>
                <statement name="ELSE">
                  <block type="text_print" id="block15">
                    <value name="TEXT">
                      <block type="text" id="block16">
                        <field name="TEXT">Droga</field>
                      </block>
                    </value>
                  </block>
                </statement>
              </block>
            </next>
          </block>
        </next>
      </block>
    </next>
  </block>
</xml>`,
  },
  kombinowane_4: {
    kategoria: "kombinowane",
    tytul: "Kombinowane 4: Licznik w pętli WHILE",
    opis: "Stwórz zmienną o nazwie 'zmienna' i ustaw ją na 1. Użyj pętli WHILE, aby wypisywać wartość tej zmiennej, dopóki jest mniejsza od 4. W każdej iteracji zwiększ zmienną o 1. Wypisz tekst 'Liczba: ' połączony z wartością zmiennej w każdej iteracji.",
    expectedXml: `<xml xmlns="https://developers.google.com/blockly/xml">
  <variables>
    <variable id="var1">zmienna</variable>
  </variables>
  <block type="variables_set" id="block1" x="10" y="10">
    <field name="VAR" id="var1">zmienna</field>
    <value name="VALUE">
      <block type="math_number" id="block2">
        <field name="NUM">1</field>
      </block>
    </value>
    <next>
      <block type="controls_whileUntil" id="block3">
        <field name="MODE">WHILE</field>
        <value name="BOOL">
          <block type="logic_compare" id="block4">
            <field name="OP">LT</field>
            <value name="A">
              <block type="variables_get" id="block5">
                <field name="VAR" id="var1">zmienna</field>
              </block>
            </value>
            <value name="B">
              <block type="math_number" id="block6">
                <field name="NUM">4</field>
              </block>
            </value>
          </block>
        </value>
        <statement name="DO">
          <block type="text_print" id="block7">
            <value name="TEXT">
              <block type="text_join" id="block8">
                <mutation items="2"></mutation>
                <value name="ADD0">
                  <block type="text" id="block9">
                    <field name="TEXT">Liczba: </field>
                  </block>
                </value>
                <value name="ADD1">
                  <block type="variables_get" id="block10">
                    <field name="VAR" id="var1">zmienna</field>
                  </block>
                </value>
              </block>
            </value>
          </block>
          <next>
            <block type="math_change" id="block11">
              <field name="VAR" id="var1">zmienna</field>
              <value name="DELTA">
                <block type="math_number" id="block12">
                  <field name="NUM">1</field>
                </block>
              </value>
            </block>
          </next>
        </statement>
      </block>
    </next>
  </block>
</xml>`,
  },
  kombinowane_5: {
    kategoria: "kombinowane",
    tytul: "Kombinowane 5: Warunek z modulo w pętli",
    opis: "Użyj pętli FOR od 10 do 20. W każdej iteracji sprawdź, czy licznik jest podzielny przez 3 (reszta z dzielenia przez 3 = 0). Jeśli tak, wypisz tekst 'Liczba X jest podzielna przez 3', gdzie X to wartość licznika. Użyj bloku 'połącz' do stworzenia tego tekstu.",
    expectedXml: `<xml xmlns="https://developers.google.com/blockly/xml">
  <variables>
    <variable id="var1">i</variable>
  </variables>
  <block type="controls_for" id="block1" x="10" y="10">
    <field name="VAR" id="var1">i</field>
    <value name="FROM">
      <block type="math_number" id="block2">
        <field name="NUM">10</field>
      </block>
    </value>
    <value name="TO">
      <block type="math_number" id="block3">
        <field name="NUM">20</field>
      </block>
    </value>
    <value name="BY">
      <block type="math_number" id="block4">
        <field name="NUM">1</field>
      </block>
    </value>
    <statement name="DO">
      <block type="controls_if" id="block5">
        <value name="IF0">
          <block type="logic_compare" id="block6">
            <field name="OP">EQ</field>
            <value name="A">
              <block type="math_modulo" id="block7">
                <value name="DIVIDEND">
                  <block type="variables_get" id="block8">
                    <field name="VAR" id="var1">i</field>
                  </block>
                </value>
                <value name="DIVISOR">
                  <block type="math_number" id="block9">
                    <field name="NUM">3</field>
                  </block>
                </value>
              </block>
            </value>
            <value name="B">
              <block type="math_number" id="block10">
                <field name="NUM">0</field>
              </block>
            </value>
          </block>
        </value>
        <statement name="DO0">
          <block type="text_print" id="block11">
            <value name="TEXT">
              <block type="text_join" id="block12">
                <mutation items="3"></mutation>
                <value name="ADD0">
                  <block type="text" id="block13">
                    <field name="TEXT">Liczba </field>
                  </block>
                </value>
                <value name="ADD1">
                  <block type="variables_get" id="block14">
                    <field name="VAR" id="var1">i</field>
                  </block>
                </value>
                <value name="ADD2">
                  <block type="text" id="block15">
                    <field name="TEXT"> jest podzielna przez 3</field>
                  </block>
                </value>
              </block>
            </value>
          </block>
        </statement>
      </block>
    </statement>
  </block>
</xml>`,
  },
  kombinowane_6: {
    kategoria: "kombinowane",
    tytul: "Kombinowane 6: Długość słowa w pętli",
    opis: "Stwórz zmienną o nazwie 'zmienna' i ustaw ją na tekst 'Programowanie'. Użyj pętli 'powtórz' 3 razy. W każdej iteracji wypisz tekst 'Długość słowa: ' połączony z długością tego słowa (użyj bloku 'długość').",
    expectedXml: `<xml xmlns="https://developers.google.com/blockly/xml">
  <variables>
    <variable id="var1">zmienna</variable>
  </variables>
  <block type="variables_set" id="block1" x="10" y="10">
    <field name="VAR" id="var1">zmienna</field>
    <value name="VALUE">
      <block type="text" id="block2">
        <field name="TEXT">Programowanie</field>
      </block>
    </value>
    <next>
      <block type="controls_repeat_ext" id="block3">
        <value name="TIMES">
          <block type="math_number" id="block4">
            <field name="NUM">3</field>
          </block>
        </value>
        <statement name="DO">
          <block type="text_print" id="block5">
            <value name="TEXT">
              <block type="text_join" id="block6">
                <mutation items="2"></mutation>
                <value name="ADD0">
                  <block type="text" id="block7">
                    <field name="TEXT">Długość słowa: </field>
                  </block>
                </value>
                <value name="ADD1">
                  <block type="text_length" id="block8">
                    <value name="VALUE">
                      <block type="variables_get" id="block9">
                        <field name="VAR" id="var1">zmienna</field>
                      </block>
                    </value>
                  </block>
                </value>
              </block>
            </value>
          </block>
        </statement>
      </block>
    </next>
  </block>
</xml>`,
  },

  // ========== GRAFICZNE (ze sceną) - ZAKOMENTOWANE ==========
  /* graficzne_1: {
    kategoria: "graficzne",
    tytul: "Graficzne 1",
    opis: "xxxx",
  }, */
};
