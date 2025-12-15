export const teoria = {
  zmienne: {
    tytul: "Zmienne",
    opis: "Zmienne to jak pudełka z etykietami. Możesz w nich przechowywać informacje, aby użyć ich później w swoim programie.",
    sekcje: [
      {
        naglowek: "Co to jest zmienna?",
        tresc: `Zmienna to **miejsce w pamięci komputera**, które ma swoją **nazwę** (jak etykieta na pudełku) i przechowuje jakąś **wartość** (jak zawartość pudełka).

* **Nazwa:** Służy do odwoływania się do zmiennej (np. \`wiek\`, \`punkty\`, \`imie_gracza\`). Nazwy powinny być zrozumiałe i nie mogą zawierać spacji.
* **Wartość:** To informacja, którą przechowujemy (np. liczba \`10\`, tekst \`"Ala"\`, lub wartość \`prawda\`).

W Blockly, zanim użyjesz zmiennej, musisz ją najpierw **stworzyć** za pomocą specjalnego przycisku.`,
        przyklad: {
          bloki: [
            {
              createVariableButton: {
                label: "Utwórz zmienną..."
              },
              opis: "Kliknij ten przycisk w kategorii 'Zmienne', aby nadać nazwę swojemu nowemu 'pudełku' (zmiennej)."
            }
          ]
        }
      },
      {
        naglowek: "1. Ustawianie wartości (Set)",
        tresc: `Pierwszą rzeczą, jaką robimy ze zmienną, jest włożenie czegoś do środka. Używamy do tego bloku **'ustaw na'**. 
        To tak, jakbyś wkładał do pudełka o nazwie \`imie\` karteczkę z napisem 'Ania'.`,
        przyklad: {
          bloki: [
            {
              xml: `<xml xmlns="https://developers.google.com/blockly/xml">
                <block type="variables_set" id="var1">
                  <field name="VAR">imie</field>
                  <value name="VALUE">
                    <block type="text">
                      <field name="TEXT">Ania</field>
                    </block>
                  </value>
                </block>
              </xml>`,
              opis: "Ten blok ustawia zmienną o nazwie 'imie' na wartość tekstową 'Ania'."
            },
            {
              xml: `<xml xmlns="https://developers.google.com/blockly/xml">
                <block type="variables_set" id="var2">
                  <field name="VAR">wiek</field>
                  <value name="VALUE">
                    <block type="math_number">
                      <field name="NUM">8</field>
                    </block>
                  </value>
                </block>
              </xml>`,
              opis: "Ten blok ustawia zmienną 'wiek' na wartość liczbową 8."
            }
          ]
        }
      },
      {
        naglowek: "2. Odczytywanie wartości (Get)",
        tresc: `Gdy chcesz sprawdzić, co jest w pudełku (zmiennej), używasz bloku z samą jej nazwą. Ten blok **zwraca** wartość, która jest aktualnie w środku.
        Możesz go podłączyć wszędzie tam, gdzie pasuje jego kształt (np. do bloku 'drukuj' lub do bloku matematycznego).`,
        przyklad: {
          bloki: [
            {
              xml: `<xml xmlns="https://developers.google.com/blockly/xml">
                <block type="text_print" id="print1">
                  <value name="TEXT">
                    <block type="variables_get">
                      <field name="VAR">imie</field>
                    </block>
                  </value>
                </block>
              </xml>`,
              opis: "Ten program wypisze na ekranie wartość zmiennej 'imie', czyli 'Ania'."
            },
            {
              xml: `<xml xmlns="https://developers.google.com/blockly/xml">
                <block type="variables_get" id="var_get">
                  <field name="VAR">wiek</field>
                </block>
              </xml>`,
              opis: "To jest właśnie blok 'Get'. Sam w sobie nic nie robi, ale \"jest\" wartością, którą przechowuje (w tym przypadku liczbą 8)."
            }
          ]
        }
      },
      {
        naglowek: "3. Zmienianie wartości (Change)",
        tresc: `Wartość zmiennej można zmieniać w trakcie działania programu. To kluczowa cecha!

1. Możesz użyć bloku **'ustaw na'** ponownie, aby całkowicie zastąpić starą wartość nową.
2. Jeśli zmienna przechowuje liczbę, możesz użyć bloku **'zmień o'**. Działa on jak skarbonka – dodaje (lub odejmuje) wartość do tej, która już tam jest. Jest idealny do liczenia punktów lub kroków.`,
        przyklad: {
          bloki: [
            {
              xml: `<xml xmlns="https://developers.google.com/blockly/xml">
                <block type="variables_set" id="var1">
                  <field name="VAR">punkty</field>
                  <value name="VALUE">
                    <block type="math_number">
                      <field name="NUM">0</field>
                    </block>
                  </value>
                  <next>
                    <block type="math_change" id="var2">
                      <field name="VAR">punkty</field>
                      <value name="DELTA">
                        <block type="math_number">
                          <field name="NUM">1</field>
                        </block>
                      </value>
                    </block>
                  </next>
                </block>
              </xml>`,
              opis: "Najpierw ustawiamy 'punkty' na 0. Potem blok 'zmień o' dodaje 1. Zmienna 'punkty' ma teraz wartość 1."
            },
            {
              xml: `<xml xmlns="https://developers.google.com/blockly/xml">
                <block type="variables_set" id="var3">
                  <field name="VAR">imie</field>
                  <value name="VALUE">
                    <block type="text">
                      <field name="TEXT">Tomek</field>
                    </block>
                  </value>
                </block>
              </xml>`,
              opis: "Jeśli wcześniej zmienna 'imie' miała wartość 'Ania', ten blok ją nadpisuje. Teraz 'imie' ma wartość 'Tomek'."
            }
          ]
        }
      },
      {
        naglowek: "Typy danych w zmiennych",
        tresc: `Zmienne mogą przechowywać różne rodzaje informacji. Blockly samo rozpoznaje typ na podstawie bloku, który do niej podłączasz.

* **Tekst (String):** Dowolny ciąg znaków, np. "Cześć", "Kot". Używamy różowych bloków tekstowych.
* **Liczba (Number):** Liczby całkowite (5, -10) lub dziesiętne (3.14). Używamy niebieskich bloków liczbowych.
* **Prawda/Fałsz (Boolean):** Tylko dwie wartości: \`prawda\` (true) lub \`fałsz\` (false). Używane w logice i warunkach (np. 'czy gracz skoczył?').
* **Lista (List):** Specjalny rodzaj zmiennej, który jest jak pudełko z przegródkami – może przechowywać wiele wartości naraz (np. lista zakupów).`,
        przyklad: {
          bloki: [
            {
              xml: `<xml xmlns="https://developers.google.com/blockly/xml">
                <block type="variables_set" id="v_bool">
                  <field name="VAR">czyPada</field>
                  <value name="VALUE">
                    <block type="logic_boolean">
                      <field name="BOOL">TRUE</field>
                    </block>
                  </value>
                </block>
              </xml>`,
              opis: "Zmienna logiczna (Boolean). 'czyPada' ma wartość 'prawda'."
            },
            {
              xml: `<xml xmlns="https://developers.google.com/blockly/xml">
                <block type="variables_set" id="v_list">
                  <field name="VAR">zakupy</field>
                  <value name="VALUE">
                    <block type="lists_create_with" id="list1">
                      <mutation items="3"></mutation>
                      <value name="ADD0">
                        <block type="text">
                          <field name="TEXT">mleko</field>
                        </block>
                      </value>
                      <value name="ADD1">
                        <block type="text">
                          <field name="TEXT">chleb</field>
                        </block>
                      </value>
                      <value name="ADD2">
                        <block type="text">
                          <field name="TEXT">jajka</field>
                        </block>
                      </value>
                    </block>
                  </value>
                </block>
              </xml>`,
              opis: "Zmienna przechowująca listę. 'zakupy' zawiera teraz 3 elementy."
            }
          ]
        }
      },
      {
        naglowek: "Praktyczny przykład: Suma",
        tresc: `Zmienne pozwalają nam rozbić problem na mniejsze kroki. Tutaj przechowujemy dwie liczby w zmiennych, a następnie wynik ich dodawania zapisujemy w trzeciej zmiennej.`,
        przyklad: {
          blocklyXml: `<xml xmlns="https://developers.google.com/blockly/xml">
            <block type="variables_set" id="v1">
              <field name="VAR">liczba1</field>
              <value name="VALUE">
                <block type="math_number">
                  <field name="NUM">5</field>
                </block>
              </value>
              <next>
                <block type="variables_set" id="v2">
                  <field name="VAR">liczba2</field>
                  <value name="VALUE">
                    <block type="math_number">
                      <field name="NUM">3</field>
                    </block>
                  </value>
                  <next>
                    <block type="variables_set" id="v3">
                      <field name="VAR">suma</field>
                      <value name="VALUE">
                        <block type="math_arithmetic">
                          <field name="OP">ADD</field>
                          <value name="A">
                            <block type="variables_get">
                              <field name="VAR">liczba1</field>
                            </block>
                          </value>
                          <value name="B">
                            <block type="variables_get">
                              <field name="VAR">liczba2</field>
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
          wyjasnienie: `1. Ustaw 'liczba1' na 5.
2. Ustaw 'liczba2' na 3.
3. Ustaw 'suma' na wynik działania 'liczba1' + 'liczba2'.

Po wykonaniu tych bloków, zmienna 'suma' będzie miała wartość 8.`
        }
      }
    ]
  },

  petle: {
    tytul: "Pętle",
    opis: "Pętle pozwalają powtarzać te same czynności wiele razy!",
    sekcje: [
      {
        naglowek: "Co to jest pętla?",
        tresc: `Pętla to sposób na powtarzanie tych samych instrukcji wiele razy. 

Wyobraź sobie, że musisz powiedzieć "Cześć!" 10 razy. Zamiast pisać to 10 razy, możesz użyć pętli, która zrobi to za Ciebie!`,
        przyklad: {
          blocklyXml: `<xml xmlns="https://developers.google.com/blockly/xml">
            <block type="controls_repeat_ext" id="loop1">
              <value name="TIMES">
                <block type="math_number">
                  <field name="NUM">10</field>
                </block>
              </value>
              <statement name="DO">
                <block type="text_print">
                  <value name="TEXT">
                    <block type="text">
                      <field name="TEXT">Cześć!</field>
                    </block>
                  </value>
                </block>
              </statement>
            </block>
          </xml>`,
          wyjasnienie: "Pętla 'powtórz' wykona instrukcję 10 razy automatycznie!"
        }
      },
      {
        naglowek: "Rodzaje pętli",
        tresc: `Istnieje kilka rodzajów pętli:

• **Pętla FOR** - gdy wiesz dokładnie, ile razy chcesz coś powtórzyć
• **Pętla WHILE** - gdy chcesz powtarzać coś, dopóki jakiś warunek jest spełniony
• **Pętla DO-WHILE** - podobna do WHILE, ale zawsze wykona się przynajmniej raz`,
        przyklad: {
          blocklyXml: `<xml xmlns="https://developers.google.com/blockly/xml">
            <block type="controls_for" id="for1">
              <field name="VAR">i</field>
              <value name="FROM">
                <block type="math_number">
                  <field name="NUM">1</field>
                </block>
              </value>
              <value name="TO">
                <block type="math_number">
                  <field name="NUM">5</field>
                </block>
              </value>
              <value name="BY">
                <block type="math_number">
                  <field name="NUM">1</field>
                </block>
              </value>
              <statement name="DO">
                <block type="text_print">
                  <value name="TEXT">
                    <block type="text_join">
                      <mutation items="2"></mutation>
                      <value name="ADD0">
                        <block type="text">
                          <field name="TEXT">Liczba: </field>
                        </block>
                      </value>
                      <value name="ADD1">
                        <block type="variables_get">
                          <field name="VAR">i</field>
                        </block>
                      </value>
                    </block>
                  </value>
                </block>
              </statement>
            </block>
          </xml>`,
          wyjasnienie: "Pętla FOR liczy od 1 do 5 i wykonuje instrukcję dla każdej liczby."
        }
      },
      {
        naglowek: "Jak działa pętla FOR?",
        tresc: `Pętla FOR składa się z trzech części:

1. **Inicjalizacja** (\`let i = 0\`) - zaczynamy od jakiejś wartości
2. **Warunek** (\`i < 10\`) - powtarzamy, dopóki warunek jest prawdziwy
3. **Krok** (\`i++\`) - zwiększamy wartość po każdym powtórzeniu`,
        przyklad: {
          blocklyXml: `<xml xmlns="https://developers.google.com/blockly/xml">
            <block type="controls_for" id="for1">
              <field name="VAR">i</field>
              <value name="FROM">
                <block type="math_number">
                  <field name="NUM">0</field>
                </block>
              </value>
              <value name="TO">
                <block type="math_number">
                  <field name="NUM">4</field>
                </block>
              </value>
              <value name="BY">
                <block type="math_number">
                  <field name="NUM">1</field>
                </block>
              </value>
              <statement name="DO">
                <block type="text_print">
                  <value name="TEXT">
                    <block type="text_join">
                      <mutation items="2"></mutation>
                      <value name="ADD0">
                        <block type="text">
                          <field name="TEXT">Powtórzenie numer: </field>
                        </block>
                      </value>
                      <value name="ADD1">
                        <block type="variables_get">
                          <field name="VAR">i</field>
                        </block>
                      </value>
                    </block>
                  </value>
                </block>
              </statement>
            </block>
          </xml>`,
          wyjasnienie: "Zmienna 'i' liczy, ile razy już wykonaliśmy pętlę - zaczyna od 0 i idzie do 4."
        }
      },
      {
        naglowek: "Praktyczne przykłady",
        tresc: `Pętle są bardzo przydatne w codziennym programowaniu:

✓ Liczenie od 1 do 100
✓ Wyświetlanie listy imion
✓ Rysowanie wielu kształtów
✓ Powtarzanie akcji w grach`,
        przyklad: {
          blocklyXml: `<xml xmlns="https://developers.google.com/blockly/xml">
            <block type="controls_for" id="for1">
              <field name="VAR">i</field>
              <value name="FROM">
                <block type="math_number">
                  <field name="NUM">1</field>
                </block>
              </value>
              <value name="TO">
                <block type="math_number">
                  <field name="NUM">10</field>
                </block>
              </value>
              <value name="BY">
                <block type="math_number">
                  <field name="NUM">1</field>
                </block>
              </value>
              <statement name="DO">
                <block type="text_print">
                  <value name="TEXT">
                    <block type="variables_get">
                      <field name="VAR">i</field>
                    </block>
                  </value>
                </block>
              </statement>
            </block>
          </xml>`,
          wyjasnienie: "Ta pętla wyświetli liczby od 1 do 10, każdą w osobnej linii."
        }
      },
      {
        naglowek: "Uwaga na nieskończone pętle!",
        tresc: `**Ważne:** Upewnij się, że pętla ma warunek, który kiedyś przestanie być spełniony! 

W przeciwnym razie pętla będzie działać w nieskończoność i program się zawiesi.`,
        przyklad: {
          blocklyXml: `<xml xmlns="https://developers.google.com/blockly/xml">
            <block type="variables_set" id="v1">
              <field name="VAR">i</field>
              <value name="VALUE">
                <block type="math_number">
                  <field name="NUM">0</field>
                </block>
              </value>
            </block>
            <block type="controls_whileUntil" id="while1">
              <field name="MODE">WHILE</field>
              <value name="BOOL">
                <block type="logic_compare">
                  <field name="OP">LT</field>
                  <value name="A">
                    <block type="variables_get">
                      <field name="VAR">i</field>
                    </block>
                  </value>
                  <value name="B">
                    <block type="math_number">
                      <field name="NUM">10</field>
                    </block>
                  </value>
                </block>
              </value>
              <statement name="DO">
                <block type="text_print">
                  <value name="TEXT">
                    <block type="variables_get">
                      <field name="VAR">i</field>
                    </block>
                  </value>
                </block>
                <block type="variables_set" id="v2">
                  <field name="VAR">i</field>
                  <value name="VALUE">
                    <block type="math_arithmetic">
                      <field name="OP">ADD</field>
                      <value name="A">
                        <block type="variables_get">
                          <field name="VAR">i</field>
                        </block>
                      </value>
                      <value name="B">
                        <block type="math_number">
                          <field name="NUM">1</field>
                        </block>
                      </value>
                    </block>
                  </value>
                </block>
              </statement>
            </block>
          </xml>`,
          wyjasnienie: "Zawsze upewnij się, że pętla ma sposób na zakończenie - tutaj zwiększamy 'i', więc kiedyś będzie >= 10."
        }
      }
    ]
  },

  warunki: {
    tytul: "Warunki",
    opis: "Warunki to mózg Twojego programu. Pozwalają komputerowi podejmować decyzje: 'Jeśli pada deszcz, weź parasol'.",
    sekcje: [
      {
        naglowek: "1. Blok JEŻELI (If)",
        tresc: "To najważniejszy blok logiczny. Sprawdza, czy coś jest prawdą. Jeśli tak – wykonuje instrukcje w środku. Jeśli nie – omija je.",
        przyklad: {
          blocklyXml: `<xml xmlns="https://developers.google.com/blockly/xml">
            <block type="controls_if" id="if1">
              <value name="IF0">
                <block type="logic_boolean">
                  <field name="BOOL">TRUE</field>
                </block>
              </value>
              <statement name="DO0">
                <block type="text_print">
                  <value name="TEXT">
                    <block type="text">
                      <field name="TEXT">To się wykona!</field>
                    </block>
                  </value>
                </block>
              </statement>
            </block>
          </xml>`,
          wyjasnienie: "Jeśli warunek (tutaj 'prawda') jest spełniony, program wejdzie do środka i wypisze tekst."
        }
      },
      {
        naglowek: "2. JEŻELI... W PRZECIWNYM RAZIE (If-Else)",
        tresc: "Czasami chcemy zrobić jedną rzecz, gdy warunek jest spełniony, a inną, gdy nie jest. Do tego służy 'W przeciwnym razie' (Else).",
        przyklad: {
          blocklyXml: `<xml xmlns="https://developers.google.com/blockly/xml">
            <block type="controls_if" id="if2">
              <mutation else="1"></mutation>
              <value name="IF0">
                <block type="logic_compare">
                  <field name="OP">GT</field>
                  <value name="A"><block type="math_number"><field name="NUM">5</field></block></value>
                  <value name="B"><block type="math_number"><field name="NUM">10</field></block></value>
                </block>
              </value>
              <statement name="DO0">
                <block type="text_print">
                  <value name="TEXT"><block type="text"><field name="TEXT">5 jest większe!</field></block></value>
                </block>
              </statement>
              <statement name="ELSE">
                <block type="text_print">
                  <value name="TEXT"><block type="text"><field name="TEXT">Nieprawda, 5 nie jest większe.</field></block></value>
                </block>
              </statement>
            </block>
          </xml>`,
          wyjasnienie: "Sprawdzamy: czy 5 > 10? To fałsz, więc program wykona część 'W przeciwnym razie'."
        }
      },
      {
        naglowek: "3. Porównania",
        tresc: "Żeby stworzyć warunek, często musimy coś porównać przy użyciu niebieskich bloków logicznych:\n\n* **=** (Czy są równe?)\n* **<** (Czy mniejsze?)\n* **>** (Czy większe?)",
        przyklad: {
          blocklyXml: `<xml xmlns="https://developers.google.com/blockly/xml">
            <block type="logic_compare">
              <field name="OP">EQ</field>
              <value name="A"><block type="math_number"><field name="NUM">10</field></block></value>
              <value name="B"><block type="math_number"><field name="NUM">10</field></block></value>
            </block>
          </xml>`,
          wyjasnienie: "Ten blok zwróci 'PRAWDA', bo 10 jest równe 10."
        }
      },
      {
        naglowek: "4. Logika złożona (ORAZ, LUB)",
        tresc: "Czasami jeden warunek nie wystarczy. Chcemy sprawdzić dwie rzeczy na raz. \n\n* **ORAZ (AND)**: Oba warunki muszą być prawdziwe (np. 'Jest sobota ORAZ świeci słońce'). \n* **LUB (OR)**: Przynajmniej jeden musi być prawdziwy (np. 'Chcę lody LUB ciastko').",
        przyklad: {
          blocklyXml: `<xml xmlns="https://developers.google.com/blockly/xml">
            <block type="controls_if" id="ifLogic">
              <value name="IF0">
                <block type="logic_operation">
                  <field name="OP">AND</field>
                  <value name="A">
                    <block type="logic_compare">
                      <field name="OP">GT</field>
                      <value name="A"><block type="math_number"><field name="NUM">10</field></block></value>
                      <value name="B"><block type="math_number"><field name="NUM">5</field></block></value>
                    </block>
                  </value>
                  <value name="B">
                    <block type="logic_compare">
                      <field name="OP">LT</field>
                      <value name="A"><block type="math_number"><field name="NUM">2</field></block></value>
                      <value name="B"><block type="math_number"><field name="NUM">8</field></block></value>
                    </block>
                  </value>
                </block>
              </value>
              <statement name="DO0">
                <block type="text_print">
                  <value name="TEXT"><block type="text"><field name="TEXT">Oba warunki są prawdziwe!</field></block></value>
                </block>
              </statement>
            </block>
          </xml>`,
          wyjasnienie: "Sprawdza, czy 10 > 5 ORAZ czy 2 < 8. Ponieważ oba zdania są prawdziwe, program wejdzie do środka."
        }
      },
      {
        naglowek: "5. Zaprzeczenie (NIE)",
        tresc: "Blok **'NIE' (NOT)** odwraca prawdę. Jeśli coś jest prawdą, 'NIE' robi z tego fałsz. Jeśli coś jest fałszem, 'NIE' robi prawdę. \n\nUżywamy tego np. 'Jeżeli NIE pada deszcz'.",
        przyklad: {
          blocklyXml: `<xml xmlns="https://developers.google.com/blockly/xml">
            <block type="controls_if" id="ifNot">
              <value name="IF0">
                <block type="logic_negate">
                  <value name="BOOL">
                    <block type="logic_boolean">
                      <field name="BOOL">FALSE</field>
                    </block>
                  </value>
                </block>
              </value>
              <statement name="DO0">
                <block type="text_print">
                  <value name="TEXT"><block type="text"><field name="TEXT">To była prawda (bo NIE Fałsz = Prawda)</field></block></value>
                </block>
              </statement>
            </block>
          </xml>`,
          wyjasnienie: "Odwraca wartość logiczną. Skoro wewnątrz jest FAŁSZ, to NIE(FAŁSZ) daje PRAWDĘ."
        }
      }
    ]
  },

  tekst: {
    tytul: "Tekst",
    opis: "Tekst (napisy) to słowa i zdania, które komputer może wypisać lub połączyć.",
    sekcje: [
      {
        naglowek: "Co to jest tekst?",
        tresc: "Tekst w programowaniu nazywamy **String** (łańcuch znaków). Zawsze otaczamy go cudzysłowem, np. \"Cześć\".",
        przyklad: {
          bloki: [
            {
              xml: `<xml xmlns="https://developers.google.com/blockly/xml">
                <block type="text">
                  <field name="TEXT">To jest tekst</field>
                </block>
              </xml>`,
              opis: "Różowy blok reprezentuje kawałek tekstu."
            }
          ]
        }
      },
      {
        naglowek: "Łączenie tekstu",
        tresc: "Możesz sklejać ze sobą różne kawałki tekstu, jak puzzle. Służy do tego blok **'utwórz tekst z'**.",
        przyklad: {
          bloki: [
            {
              xml: `<xml xmlns="https://developers.google.com/blockly/xml">
                <block type="text_join">
                  <mutation items="2"></mutation>
                  <value name="ADD0">
                    <block type="text">
                      <field name="TEXT">Cześć </field>
                    </block>
                  </value>
                  <value name="ADD1">
                    <block type="text">
                      <field name="TEXT">Świecie</field>
                    </block>
                  </value>
                </block>
              </xml>`,
              opis: "Ten blok połączy 'Cześć ' i 'Świecie' w jeden napis: 'Cześć Świecie'."
            }
          ]
        }
      },
      {
        naglowek: "Wypisywanie (Print)",
        tresc: "Aby zobaczyć wynik działania programu, używamy bloku **'wypisz'**. To jak powiedzenie komputerowi: 'Pokaż mi to na ekranie!'",
        przyklad: {
          bloki: [
            {
              xml: `<xml xmlns="https://developers.google.com/blockly/xml">
                <block type="text_print">
                  <value name="TEXT">
                    <block type="text">
                      <field name="TEXT">Działa!</field>
                    </block>
                  </value>
                </block>
              </xml>`,
              opis: "Wyświetli komunikat 'Działa!' w okienku."
            }
          ]
        }
      },
      {
        naglowek: "Długość tekstu",
        tresc: "Komputer umie policzyć litery szybciej niż Ty! Blok **'długość'** mówi nam, z ilu znaków składa się napis.",
        przyklad: {
          bloki: [
            {
              xml: `<xml xmlns="https://developers.google.com/blockly/xml">
                <block type="text_length">
                  <value name="VALUE">
                    <block type="text">
                      <field name="TEXT">Krokodyl</field>
                    </block>
                  </value>
                </block>
              </xml>`,
              opis: "Zwróci liczbę 8, bo słowo 'Krokodyl' ma 8 liter."
            }
          ]
        }
      },
      {
        naglowek: "Wielkie i małe litery",
        tresc: "Czasami chcemy krzyczeć (DUŻE LITERY) lub szeptać (małe litery). Ten blok zmienia wielkość liter w tekście.",
        przyklad: {
          bloki: [
            {
              xml: `<xml xmlns="https://developers.google.com/blockly/xml">
                <block type="text_changeCase">
                  <field name="CASE">UPPERCASE</field>
                  <value name="TEXT">
                    <block type="text">
                      <field name="TEXT">cicho sza</field>
                    </block>
                  </value>
                </block>
              </xml>`,
              opis: "Zmieni 'cicho sza' na 'CICHO SZA'."
            }
          ]
        }
      }
    ]
  },

  matematyczne: {
    tytul: "Matematyka",
    opis: "Komputery są świetne w liczeniu! Możesz wykonywać dodawanie, odejmowanie i trudniejsze zadania.",
    sekcje: [
      {
        naglowek: "Podstawowe działania",
        tresc: "Niebieskie bloki służą do liczenia. Możesz dodawać (+), odejmować (-), mnożyć (*) i dzielić (/).",
        przyklad: {
          bloki: [
            {
              xml: `<xml xmlns="https://developers.google.com/blockly/xml">
                <block type="math_arithmetic">
                  <field name="OP">ADD</field>
                  <value name="A">
                    <block type="math_number">
                      <field name="NUM">2</field>
                    </block>
                  </value>
                  <value name="B">
                    <block type="math_number">
                      <field name="NUM">2</field>
                    </block>
                  </value>
                </block>
              </xml>`,
              opis: "Proste dodawanie: 2 + 2."
            }
          ]
        }
      },
      {
        naglowek: "Reszta z dzielenia (Modulo)",
        tresc: "To bardzo przydatny blok! Sprawdza, co zostaje po podzieleniu jednej liczby przez drugą. Np. 5 podzielić przez 2 to 2 całe i **1 reszty**.\n\n* Używamy tego często, żeby sprawdzić, czy liczba jest parzysta (reszta z dzielenia przez 2 wynosi 0).",
        przyklad: {
          bloki: [
            {
              xml: `<xml xmlns="https://developers.google.com/blockly/xml">
                <block type="math_modulo">
                  <value name="DIVIDEND">
                    <block type="math_number">
                      <field name="NUM">5</field>
                    </block>
                  </value>
                  <value name="DIVISOR">
                    <block type="math_number">
                      <field name="NUM">2</field>
                    </block>
                  </value>
                </block>
              </xml>`,
              opis: "Zwróci 1, bo w 5 mieszczą się dwie dwójki i zostaje 1."
            }
          ]
        }
      },
      {
        naglowek: "Losowość",
        tresc: "Komputer może 'rzucać kostką' za Ciebie! Blok losowania wybiera przypadkową liczbę z podanego zakresu.",
        przyklad: {
          bloki: [
            {
              xml: `<xml xmlns="https://developers.google.com/blockly/xml">
                <block type="math_random_int">
                  <value name="FROM">
                    <block type="math_number">
                      <field name="NUM">1</field>
                    </block>
                  </value>
                  <value name="TO">
                    <block type="math_number">
                      <field name="NUM">6</field>
                    </block>
                  </value>
                </block>
              </xml>`,
              opis: "Wylosuje liczbę od 1 do 6 (jak rzut kostką)."
            }
          ]
        }
      },
      {
        naglowek: "Zaokrąglanie",
        tresc: "Jeśli wynik dzielenia wyjdzie z przecinkiem (np. 3.14), możesz go zaokrąglić do zwykłej, całkowitej liczby.",
        przyklad: {
          bloki: [
            {
              xml: `<xml xmlns="https://developers.google.com/blockly/xml">
                <block type="math_round">
                  <field name="OP">ROUND</field>
                  <value name="NUM">
                    <block type="math_number">
                      <field name="NUM">3.7</field>
                    </block>
                  </value>
                </block>
              </xml>`,
              opis: "Zaokrągli liczbę 3.7 do 4."
            }
          ]
        }
      }
    ]
  },

  kombinowane: {
    tytul: "Kombinowane",
    opis: "Prawdziwa moc programowania bierze się z łączenia wszystkiego, czego się nauczyłeś!",
    sekcje: [
      {
        naglowek: "Pętle i Warunki",
        tresc: "Często wkładamy warunek 'JEŻELI' do środka 'PĘTLI'. To pozwala komputerowi podejmować decyzje wielokrotnie.\n\nNp. sprawdź każdą liczbę od 1 do 10 i wypisz tylko te, które są parzyste.",
        przyklad: {
          blocklyXml: `<xml xmlns="https://developers.google.com/blockly/xml">
            <block type="controls_for">
              <field name="VAR">i</field>
              <value name="FROM"><block type="math_number"><field name="NUM">1</field></block></value>
              <value name="TO"><block type="math_number"><field name="NUM">10</field></block></value>
              <statement name="DO">
                <block type="controls_if">
                  <value name="IF0">
                    <block type="logic_compare">
                      <field name="OP">EQ</field>
                      <value name="A">
                        <block type="math_modulo">
                          <value name="DIVIDEND"><block type="variables_get"><field name="VAR">i</field></block></value>
                          <value name="DIVISOR"><block type="math_number"><field name="NUM">2</field></block></value>
                        </block>
                      </value>
                      <value name="B"><block type="math_number"><field name="NUM">0</field></block></value>
                    </block>
                  </value>
                  <statement name="DO0">
                    <block type="text_print">
                      <value name="TEXT"><block type="variables_get"><field name="VAR">i</field></block></value>
                    </block>
                  </statement>
                </block>
              </statement>
            </block>
          </xml>`,
          wyjasnienie: "Klasyczny przykład: Pętla przechodzi przez liczby, a IF w środku wybiera tylko parzyste."
        }
      },
      {
        naglowek: "Algorytm: Zliczanie",
        tresc: "To klasyczne zadanie: Chcesz policzyć, ile razy coś się wydarzyło. \n\n1. Stwórz zmienną `licznik` = 0.\n2. W pętli, jeśli coś znajdziesz (IF), zwiększ `licznik` o 1.\n3. Na końcu wypisz `licznik`.",
        przyklad: {
          blocklyXml: `<xml xmlns="https://developers.google.com/blockly/xml">
            <block type="variables_set" id="v1">
              <field name="VAR">licznik</field>
              <value name="VALUE"><block type="math_number"><field name="NUM">0</field></block></value>
              <next>
                <block type="controls_for">
                  <field name="VAR">i</field>
                  <value name="FROM"><block type="math_number"><field name="NUM">1</field></block></value>
                  <value name="TO"><block type="math_number"><field name="NUM">10</field></block></value>
                  <statement name="DO">
                    <block type="controls_if">
                      <value name="IF0">
                        <block type="logic_compare">
                          <field name="OP">GT</field>
                          <value name="A"><block type="variables_get"><field name="VAR">i</field></block></value>
                          <value name="B"><block type="math_number"><field name="NUM">5</field></block></value>
                        </block>
                      </value>
                      <statement name="DO0">
                        <block type="math_change">
                          <field name="VAR">licznik</field>
                          <value name="DELTA"><block type="math_number"><field name="NUM">1</field></block></value>
                        </block>
                      </statement>
                    </block>
                  </statement>
                  <next>
                     <block type="text_print">
                        <value name="TEXT">
                           <block type="text_join">
                             <mutation items="2"></mutation>
                             <value name="ADD0"><block type="text"><field name="TEXT">Liczb > 5 jest: </field></block></value>
                             <value name="ADD1"><block type="variables_get"><field name="VAR">licznik</field></block></value>
                           </block>
                        </value>
                     </block>
                  </next>
                </block>
              </next>
            </block>
          </xml>`,
          wyjasnienie: "Program przechodzi liczby od 1 do 10. Jeśli liczba jest > 5, dodaje 1 do licznika. Na koniec wypisuje wynik (5)."
        }
      },
      {
        naglowek: "Algorytm: Sumowanie",
        tresc: "Bardzo podobny do zliczania, ale zamiast dodawać 1, dodajemy wartość (np. liczbę punktów). \n\nPrzykład: Oblicz sumę liczb od 1 do 5 (1+2+3+4+5).",
        przyklad: {
          blocklyXml: `<xml xmlns="https://developers.google.com/blockly/xml">
            <block type="variables_set" id="vSum">
              <field name="VAR">suma</field>
              <value name="VALUE"><block type="math_number"><field name="NUM">0</field></block></value>
              <next>
                <block type="controls_for">
                  <field name="VAR">i</field>
                  <value name="FROM"><block type="math_number"><field name="NUM">1</field></block></value>
                  <value name="TO"><block type="math_number"><field name="NUM">5</field></block></value>
                  <statement name="DO">
                    <block type="math_change">
                      <field name="VAR">suma</field>
                      <value name="DELTA"><block type="variables_get"><field name="VAR">i</field></block></value>
                    </block>
                  </statement>
                  <next>
                    <block type="text_print">
                      <value name="TEXT">
                        <block type="text_join">
                          <mutation items="2"></mutation>
                          <value name="ADD0"><block type="text"><field name="TEXT">Suma to: </field></block></value>
                          <value name="ADD1"><block type="variables_get"><field name="VAR">suma</field></block></value>
                        </block>
                      </value>
                    </block>
                  </next>
                </block>
              </next>
            </block>
          </xml>`,
          wyjasnienie: "Zmienna 'suma' zaczyna od 0. W każdym kroku pętli dodajemy do niej aktualną wartość licznika 'i'."
        }
      },
      {
        naglowek: "Pętla 'Dopóki' (While) - Rzut kostką",
        tresc: "To pętla, która działa tak długo, aż spełni się marzenie (warunek). \n\nPrzykład: Rzucaj kostką tak długo, aż wylosujesz szóstkę.",
        przyklad: {
          blocklyXml: `<xml xmlns="https://developers.google.com/blockly/xml">
            <block type="variables_set" id="vDice">
              <field name="VAR">kostka</field>
              <value name="VALUE"><block type="math_number"><field name="NUM">0</field></block></value>
              <next>
                <block type="controls_whileUntil">
                  <field name="MODE">WHILE</field>
                  <value name="BOOL">
                    <block type="logic_compare">
                      <field name="OP">NEQ</field>
                      <value name="A"><block type="variables_get"><field name="VAR">kostka</field></block></value>
                      <value name="B"><block type="math_number"><field name="NUM">6</field></block></value>
                    </block>
                  </value>
                  <statement name="DO">
                    <block type="variables_set">
                      <field name="VAR">kostka</field>
                      <value name="VALUE">
                        <block type="math_random_int">
                          <value name="FROM"><block type="math_number"><field name="NUM">1</field></block></value>
                          <value name="TO"><block type="math_number"><field name="NUM">6</field></block></value>
                        </block>
                      </value>
                      <next>
                        <block type="text_print">
                          <value name="TEXT">
                             <block type="text_join">
                               <mutation items="2"></mutation>
                               <value name="ADD0"><block type="text"><field name="TEXT">Wylosowano: </field></block></value>
                               <value name="ADD1"><block type="variables_get"><field name="VAR">kostka</field></block></value>
                             </block>
                          </value>
                        </block>
                      </next>
                    </block>
                  </statement>
                  <next>
                    <block type="text_print">
                      <value name="TEXT"><block type="text"><field name="TEXT">Hura! Mamy szóstkę!</field></block></value>
                    </block>
                  </next>
                </block>
              </next>
            </block>
          </xml>`,
          wyjasnienie: "Pętla 'dopóki kostka ≠ 6' będzie losować nową liczbę i ją wypisywać. Skończy się dopiero, gdy 'kostka' będzie równa 6."
        }
      }
    ]
  },

  // ========== TEORIA GRAFICZNA - ZAKOMENTOWANA ==========
  /* graficzne: {
    tytul: "Grafika",
    opis: "Czas na zabawę obrazkami! Możesz tworzyć postacie (Sprite'y) i nimi poruszać.",
    sekcje: [
      {
        naglowek: "Układ współrzędnych (X, Y)",
        tresc: "Ekran to tak naprawdę siatka. Każdy punkt ma swój adres:\n* **X** to pozycja pozioma (lewo/prawo). 0 to środek. W prawo liczby rosną, w lewo maleją (minusowe).\n* **Y** to pozycja pionowa (góra/dół). 0 to środek."
      },
      {
        naglowek: "Tworzenie Sprite'a",
        tresc: "Sprite to obrazek, którym możesz sterować. Musisz go stworzyć i nadać mu nazwę (zmienną), żeby potem wydawać mu polecenia.",
        przyklad: {
          bloki: [
            {
              xml: `<xml xmlns="https://developers.google.com/blockly/xml">
                <block type="stage_create_sprite_as">
                  <field name="VAR">kot</field>
                  <value name="URL">
                    <block type="text">
                      <field name="TEXT">https://i.imgur.com/N6dGgJc.png</field>
                    </block>
                  </value>
                </block>
              </xml>`,
              opis: "Tworzy postać 'kot' z podanego obrazka."
            }
          ]
        }
      },
      {
        naglowek: "Ruch",
        tresc: "Gdy masz już sprite'a, możesz go przesuwać blokiema **'przesuń o'** lub ustawić w konkretnym miejscu **'ustaw pozycję'**.",
        przyklad: {
          bloki: [
            {
              xml: `<xml xmlns="https://developers.google.com/blockly/xml">
                <block type="stage_move_by">
                  <value name="ID">
                    <block type="variables_get">
                      <field name="VAR">kot</field>
                    </block>
                  </value>
                  <value name="DX">
                    <block type="math_number">
                      <field name="NUM">10</field>
                    </block>
                  </value>
                </block>
              </xml>`,
              opis: "Przesuwa 'kota' o 10 kroków w prawo."
            }
          ]
        }
      }
    ]
  } */
};
