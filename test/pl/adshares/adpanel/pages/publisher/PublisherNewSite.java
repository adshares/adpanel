package pl.adshares.adpanel.pages.publisher;

import org.openqa.selenium.Alert;
import org.openqa.selenium.NoAlertPresentException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.Assert;

import java.util.Random;

public class PublisherNewSite {
  @FindBy(css = "[data-test='publisher-edit-site-basic-information-form-url']")   private WebElement websiteUrl;
//  @FindBy(css = "[class='mat-input-infix mat-form-field-infix']")                 private WebElement contentLanguage;
  @FindBy(id = "languageInput")                                                   private WebElement contentLanguage;
  @FindBy(xpath = "//span[contains(text(), 'Polish')]")                           private WebElement contentLanguagePolish;
  @FindBy(xpath = "//span[contains(text(), 'English')]")                          private WebElement contentLanguageEnglish;
  @FindBy(xpath = "//*[contains(text(), 'Save & Continue')]")                                                           private WebElement saveContinue;
  @FindBy(xpath = "//*[contains(text(), 'Back to Dashboard')]")                                                         private WebElement backToDashboard;
  @FindBy(css = "[class='error-msg ng-star-inserted']")                           private WebElement AssertionErrorMsgNgStarInserted;
  @FindBy(xpath = "//span[contains(text(), 'Please provide a valid URL.')]")      private WebElement AssertionPleaseProvideAValidURL;
  @FindBy(xpath = "//*[contains(text(), 'Website name')]")                                                              private WebElement AssertWebsiteName;
  @FindBy(xpath = "//*[contains(text(), 'Content Language')]")                                                          private WebElement AssertContentLanguage;
  @FindBy(xpath = "//*[contains(text(), '1. Requires')]")                                                               private WebElement AssertAdditionalTargeting1;
  @FindBy(xpath = "//*[contains(text(), '2. Excludes')]")                                                               private WebElement AssertAdditionalTargeting2;
  @FindBy(xpath = "//*[contains(text(), 'My Sites')]")                                                                  private WebElement AssertMySites;
  @FindBy(id = "cdk-overlay-10")                                                                                        private WebElement contentLanguageAutocomplete;

  private WebDriver driver;
  private WebDriverWait wait;

  public PublisherNewSite(WebDriver driver) {
    this.driver = driver;
    wait = new WebDriverWait(driver, 100);
    PageFactory.initElements(driver, this);
  }

  private void alert() {
    int i=0;
    while (i++<5) {
      try {
        Alert alert = driver.switchTo().alert();
        System.out.println("Alert - " + alert.getText());
        alert.accept();
      } catch (NoAlertPresentException e) {
        try {
          Thread.sleep(1000);
        } catch (InterruptedException e1) {
          e1.printStackTrace();
        }
        continue;
      }
    }
  }

  public void basicInformation() {
    System.out.println("---------- publisherBasicInformation ----------");
    wait.until(ExpectedConditions.visibilityOf(websiteUrl));
    String[] language = {"Abkhazian", "Afar", "Afrikaans","Akan","Albanian","Amharic","Arabic","Aragonese","Armenian","Assamese","Avaric","Avestan","Aymara","Azerbaijani","Bambara","Bashkir","Basque","Belarusian","Bengali","Bihari languages","Bislama","Bosnian","Breton","Bulgarian","Burmese","Catalan, Valencian","Central Khmer","Chamorro","Chechen","Chichewa, Chewa, Nyanja","Chinese","Church Slavonic, Old Bulgarian, Old Church Slavonic","Chuvash","Cornish","Corsican","Cree","Croatian","Czech","Danish","Divehi, Dhivehi, Maldivian","Dutch, Flemish","Dzongkha","English","Esperanto","Estonian","Ewe","Faroese","Fijian","Finnish","French","Fulah","Gaelic, Scottish Gaelic","Galician","Ganda","Georgian","German","Gikuyu, Kikuyu","Greek (Modern)","Greenlandic, Kalaallisut","Guarani","Gujarati","Haitian, Haitian Creole","Hausa","Hebrew","Herero","Hindi","Hiri Motu","Hungarian","Icelandic","Ido","Igbo","Indonesian","Interlingua (International Auxiliary Language Association)","Interlingue","Inuktitut","Inupiaq","Irish","Italian","Japanese","Javanese","Kannada","Kanuri","Kashmiri","Kazakh","Kinyarwanda","Komi","Kongo","Korean","Kwanyama, Kuanyama","Kurdish","Kyrgyz","Lao","Latin","Latvian","Letzeburgesch, Luxembourgish","Limburgish, Limburgan, Limburger","Lingala","Lithuanian","Luba-Katanga","Macedonian","Malagasy","Malay","Malayalam","Maltese","Manx","Maori","Marathi","Marshallese","Moldovan, Moldavian, Romanian","Mongolian","Nauru","Navajo, Navaho","Northern Ndebele","Ndonga","Nepali","Northern Sami","Norwegian","Norwegian Bokmål","Norwegian Nynorsk","Nuosu, Sichuan Yi","Occitan (post 1500)","Ojibwa","Oriya","Oromo","Ossetian, Ossetic","Pali","Panjabi, Punjabi","Pashto, Pushto","Persian","Polish","Portuguese","Quechua","Romansh","Rundi","Russian","Samoan","Sango","Sanskrit","Sardinian","Serbian","Shona","Sindhi","Sinhala, Sinhalese","Slovak","Slovenian","Somali","Sotho, Southern","South Ndebele","Spanish, Castilian","Sundanese","Swahili","Swati","Swedish","Tagalog","Tahitian","Tajik","Tamil","Tatar","Telugu","Thai","Tibetan","Tigrinya","Tonga (Tonga Islands)","Tsonga","Tswana","Turkish","Turkmen","Twi","Uighur, Uyghur","Ukrainian","Urdu","Uzbek","Venda","Vietnamese","Volap_k","Walloon","Welsh","Western Frisian","Wolof","Xhosa","Yiddish","Yoruba","Zhuang, Chuang","Zulu"};
    String content_language = (language[new Random().nextInt(language.length)]);
    Random random = new Random();
    int number = random.nextInt(10000);

    String Url=content_language+"_"+number;
    websiteUrl.clear();
    websiteUrl.sendKeys(Url);
    System.out.println("Url:              "+Url);

    wait.until(ExpectedConditions.visibilityOf(contentLanguage));
    try {
      Thread.sleep(1000);
    } catch (InterruptedException e1) {
      e1.printStackTrace();
    }
    contentLanguage.clear();
    try {
      Thread.sleep(1000);
    } catch (InterruptedException e1) {
      e1.printStackTrace();
    }
    contentLanguage.sendKeys(content_language);
    try {
      Thread.sleep(1000);
    } catch (InterruptedException e1) {
      e1.printStackTrace();
    }
//    wait.until(ExpectedConditions.visibilityOf(contentLanguageAutocomplete));
    try {
      Thread.sleep(1000);
    } catch (InterruptedException e1) {
      e1.printStackTrace();
    }
//    contentLanguageAutocomplete.click();
    System.out.println("content_language: "+content_language);

    Assert.assertEquals("Website name", AssertWebsiteName.getText());
    System.out.println("Assert - "+AssertWebsiteName.getText());
    Assert.assertEquals("Content Language", AssertContentLanguage.getText());
    System.out.println("Assert - "+AssertContentLanguage.getText());
  }
  public void basicInformationSaveContinue() {
    System.out.println("---------- basicInformationSaveContinue ----------");
    wait.until(ExpectedConditions.visibilityOf(saveContinue));
    saveContinue.click();
    System.out.println("Click - saveButtonPublisherCampaign");
    wait.until(ExpectedConditions.visibilityOf(AssertAdditionalTargeting1));
    wait.until(ExpectedConditions.visibilityOf(AssertAdditionalTargeting1));
    Assert.assertEquals("1. Requires", AssertAdditionalTargeting1.getText());
    System.out.println("Assert - "+AssertAdditionalTargeting1.getText());
    Assert.assertEquals("2. Excludes", AssertAdditionalTargeting2.getText());
    System.out.println("Assert - "+AssertAdditionalTargeting2.getText());
  }
  public void basicInformationBackToDashboard() {
    System.out.println("---------- basicInformationBackToDashboard ----------");
    wait.until(ExpectedConditions.visibilityOf(backToDashboard));
    backToDashboard.click();
    System.out.println("Click - backButtonPublisherCampaign");
    alert();
    wait.until(ExpectedConditions.visibilityOf(AssertMySites));
    Assert.assertEquals("My Sites", AssertMySites.getText());
    System.out.println("Assert - "+AssertMySites.getText());
  }
  public void basicInformationError(String website_name_or_url)  {
    System.out.println("---------- publisherBasicInformationError ----------");
    wait.until(ExpectedConditions.visibilityOf(websiteUrl));
    websiteUrl.clear();
    websiteUrl.sendKeys(website_name_or_url);
    System.out.println("website_name_or_url: "+website_name_or_url);
    contentLanguage.click();
    wait.until(ExpectedConditions.visibilityOf(contentLanguageEnglish));
    contentLanguageEnglish.click();
    wait.until(ExpectedConditions.visibilityOf(saveContinue));
    saveContinue.click();
    System.out.println("Click - saveButtonPublisherCampaign");
    wait.until(ExpectedConditions.visibilityOf(AssertionErrorMsgNgStarInserted));
    Assert.assertEquals("Please provide a valid URL.", AssertionPleaseProvideAValidURL.getText());
    System.out.println("Assert - "+AssertionPleaseProvideAValidURL.getText());
  }
}
