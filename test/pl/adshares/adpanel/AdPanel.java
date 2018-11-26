package pl.adshares.adpanel;

import pl.adshares.adpanel.enums.Properties;
import pl.adshares.adpanel.pages.*;
import pl.adshares.adpanel.pages.RegisterPage;
import pl.adshares.adpanel.pages.advertiser.AdvertiserMainPage;
import pl.adshares.adpanel.pages.publisher.*;
import pl.adshares.adpanel.setup.BrowserTestCase;
import pl.adshares.adpanel.tools.Maps;
import pl.adshares.adpanel.tools.Structure;
import pl.adshares.adpanel.tools.Xml;
import org.testng.annotations.BeforeTest;
import org.testng.annotations.Test;

public class AdPanel extends BrowserTestCase {

  private String url_panel = "http://localhost:8102/";
  private String url_mailhog = "http://localhost:8025/";
  private String url_mailcatcher = "http://mailcatcher.ads/";
  private String url_target = "http://localhost:8101/test-publisher/index.html";
  private String login_random = "false";

  private String admin = "admin@e11.click";
  private String password_admin = "adminadmin";
  private String user = "user@e11.click";
  private String password = "useruser";
  private String publisher = "publisher@e11.click";
  private String password_publisher = "publisher";
  private String advertiser = "advertiser@e11.click";
  private String password_advertiser = "advertiser";


  private RegisterPage registerPage;
  private LoginPage loginPage;
  private DashboardPopup dashboardPopup;
  private HeaderBarPage headerBarPage;
  private Mailcatcher mailcatcher;
  private AdvertiserMainPage advertiserMainPage;
  private PublisherMainPage publisherMainPage;
  private PublisherNewSite publisherNewSite;
  private SiteAdditionalTargeting siteAdditionalTargeting;
  private SiteCreateAds siteCreateAds;
  private SiteSummary siteSummary;
  private PublisherEditSite publisherEditSite;

  private String loginAdService;
  private String passwordAdService;
  private String randomsEmail;

  public AdPanel() {
  }

  @BeforeTest
  public void setUp() {
    Maps.url();
    Maps.url_panel("url_panel", url_panel);
    Maps.url_mailcatcher("url_mailcatcher", url_mailcatcher);
    Maps.url_mailhog("url_mailhog", url_mailhog);
    Maps.url_target("url_target", url_target);

    loginAdService = Xml.getValue(Structure.CONFIG_PROPERTIES, Properties.PROPERTY, Properties.EMAIL);
    passwordAdService = Xml.getValue(Structure.CONFIG_PROPERTIES, Properties.PROPERTY, Properties.PASSWORD);
  }
  @Test
  public void sleep() {
    int s;
    int x=1000;
    for (s=0; s<x; s++) {
      try {
        Thread.sleep(1000);
      } catch (InterruptedException e) {
        e.printStackTrace();
      }
      System.out.println("sleep: "+x+"s.");
      x=x-1;
    }
  }

  @Test
  public void logInUserPublisher() {
    loginPage = new LoginPage(driver);
    if (login_random.equals("true")) {loginPage.RandomEmail(password);}else{loginPage.UserEmail(publisher,password_publisher);}
    loginPage.logIn();
    dashboardPopup = new DashboardPopup(driver);
    if (login_random.equals("true")) {dashboardPopup.popUpFirstPublisher();}else{dashboardPopup.popUpPublisher();}
  }
  @Test
  public void logInUserAdvertiser() {
    loginPage = new LoginPage(driver);
    if (login_random.equals("true")) {loginPage.RandomEmail(password);}else{loginPage.UserEmail(advertiser,password_advertiser);}
    loginPage.logIn();
    dashboardPopup = new DashboardPopup(driver);
    if (login_random.equals("true")) {dashboardPopup.popUpFirstAdvertiser();}else{dashboardPopup.popUpAdvertiser();}
  }
  @Test
  public void logInUserAdvertiserPublisher() {
    loginPage = new LoginPage(driver);
    if (login_random.equals("true")) {loginPage.RandomEmail(password);}else{loginPage.UserEmail(user,password);}
    loginPage.logIn();
    dashboardPopup = new DashboardPopup(driver);
    dashboardPopup.popUpFirstAdvertiserPublisher();
//    dashboardPopup.popUpAdvertiser();
    dashboardPopup.popUpPublisher();
  }

  @Test
  public void loginPopUpAdvertiser(){
    dashboardPopup = new DashboardPopup(driver);
    dashboardPopup.popUpAdvertiser();
  }
  @Test
  public void logInPopUpPublisher(){
    dashboardPopup = new DashboardPopup(driver);
    dashboardPopup.popUpPublisher();
  }
  @Test
  public void logInPopUpFirstAdvertiser(){
    dashboardPopup = new DashboardPopup(driver);
    dashboardPopup.popUpFirstAdvertiser();
  }
  @Test
  public void logInPopUpFirstPublisher() {
    dashboardPopup = new DashboardPopup(driver);
    dashboardPopup.popUpFirstPublisher();
  }
  @Test
  public void logInPopUpFirstAdvertiserPublisher(){
    dashboardPopup = new DashboardPopup(driver);
    dashboardPopup.popUpFirstAdvertiserPublisher();
  }

  @Test
  public void firstLogInPopUp() {
    dashboardPopup = new DashboardPopup(driver);
    dashboardPopup.chooseAccountTypeAllTypes();
  }
  @Test
  private void logInRandomEmail() {
    loginPage = new LoginPage(driver);
    loginPage.RandomEmail(password);
    loginPage.logIn();
  }
  @Test
  public void logInRandomEmailRememberMe() {
    loginPage = new LoginPage(driver);
    loginPage.RandomEmail(password);
    loginPage.logInRememberMe();
  }

  @Test
  public void logInUserEmail() {
    loginPage = new LoginPage(driver);
    loginPage.UserEmail(user,password);
    loginPage.logIn();
  }
  @Test
  public void logInUserEmailRememberMe() {
    loginPage = new LoginPage(driver);
    loginPage.UserEmail(user,password);
    loginPage.logInRememberMe();
  }

  @Test
  public void logInChangingTheDashboardBack() {
    loginPage = new LoginPage(driver);
    loginPage.goToLoginChangingTheDashboardBack();
  }

  @Test
  public void logInChangeEmailNegative()  {
    loginPage = new LoginPage(driver);
    loginPage.gotologinChangeEmailNegative();
  }

  @Test
  public void logInChangePasswordNegative() {
    loginPage = new LoginPage(driver);
    loginPage.gotologinChangePasswordNegative();
  }

  @Test
  public void logInFAQ() {
    loginPage = new LoginPage(driver);
    loginPage.gotologinFAQ();
  }

  @Test
  public void logOut() {
    System.out.println("---------- logOut ----------");
    headerBarPage = new HeaderBarPage(driver);
    headerBarPage.logOut();
    loginPage = new LoginPage(driver);
    loginPage.pageLayoutValidation();
  }

  @Test
  public void Registration_RandomEmail() {                      System.out.println("---------- TS_1 - TC_1 ----------");
    logInRandomEmail();
  }
  @Test
  public void Registration_Error() {                            System.out.println("---------- TS_1 - TC_2 ----------");
    loginPage = new LoginPage(driver);
    loginPage.goToLoginRegistration();
  }
  @Test
  public void Registration_ForgotPassword() {                   System.out.println("---------- TS_1 - TC_3 ----------");
    registerPage = new RegisterPage(driver);
    registerPage.registerForgotPassword(Maps.getEmail("email"),"ADS11ads");
  }
  @Test
  public void logInPageObjectValidation() {                     System.out.println("---------- TS_2 - TC_1 ----------");
    loginPage = new LoginPage(driver);
    loginPage.loginRequiredEmailValidation();
    loginPage.loginInvalidEmailValidation();
    loginPage.loginPasswordValidation();
  }
  @Test
  public void logInPageCrossAccessValidation() {                System.out.println("---------- TS_2 - TC_2 ----------");
    loginPage = new LoginPage(driver);
    loginPage.wrongEmailCorrectPassword(passwordAdService);
    driver.navigate().refresh();
    loginPage.wrongPasswordCorrectEmail(loginAdService);
  }
  @Test
  public void logInWithRolePublisher() {                        System.out.println("---------- TS_2 - TC_3 ----------");
  }
  @Test
  public void logInWithRoleAdvertiser() {                       System.out.println("---------- TS_2 - TC_4 ----------");
  }
  @Test
  public void logInWithRoleAdvertiserPublisher() {              System.out.println("---------- TS_2 - TC_5 ----------");
  }
  @Test
  public void logInChangeEmail() {                        System.out.println("---------- TS_2 - TC_6 logIn ----------");
    System.out.print("1/8 ");    loginPage = new LoginPage(driver);             loginPage.gotologinChangeEmail();
    System.out.print("2/8 ");    mailcatcher = new Mailcatcher(driver);         mailcatcher.mailcatcherEmail();
    System.out.print("3/8 ");    loginPage = new LoginPage(driver);             loginPage.adshDialogCloseAndWindow();
    System.out.print("4/8 ");    mailcatcher = new Mailcatcher(driver);         mailcatcher.mailcatcherEmail();
    System.out.print("5/8 ");    loginPage = new LoginPage(driver);             loginPage.adshDialogCloseAndWindow();
    System.out.print("6/8 ");    headerBarPage = new HeaderBarPage(driver);     headerBarPage.logOut();
    System.out.print("7/8 ");    loginPage = new LoginPage(driver);             loginPage.loginSignIn(Maps.get_new_email("new_email"), Maps.getPassword("password"));
    System.out.print("8/8 ");    headerBarPage = new HeaderBarPage(driver);     headerBarPage.logOut();
  }
  @Test
  public void logOutChangeEmail() {                      System.out.println("---------- TS_2 - TC_6 logOut ----------");
    System.out.print("1/16 ");    loginPage = new LoginPage(driver);              loginPage.gotologinChangeEmail();
    System.out.print("2/16 ");    headerBarPage = new HeaderBarPage(driver);      headerBarPage.logOut();
    System.out.print("3/16 ");    mailcatcher = new Mailcatcher(driver);          mailcatcher.mailcatcherEmail();
    System.out.print("4/16 ");    loginPage = new LoginPage(driver);              loginPage.adshDialogCloseAndWindow();
    System.out.print("5/16 ");    loginPage = new LoginPage(driver);              loginPage.loginSignIn(Maps.getEmail("email"), Maps.getPassword("password"));
    System.out.print("6/16 ");    mailcatcher = new Mailcatcher(driver);          mailcatcher.mailcatcherEmail();
    System.out.print("7/16 ");    loginPage = new LoginPage(driver);              loginPage.adshDialogCloseAndWindow();
    System.out.print("8/16 ");    headerBarPage = new HeaderBarPage(driver);      headerBarPage.logOut();
    System.out.print("9/16 ");    mailcatcher = new Mailcatcher(driver);          mailcatcher.mailcatcherEmail();
    System.out.print("10/16 ");    loginPage = new LoginPage(driver);             loginPage.adshDialogCloseAndWindow();
    System.out.print("11/16 ");    loginPage = new LoginPage(driver);             loginPage.loginSignIn(Maps.getEmail("email"), Maps.getPassword("password"));
    System.out.print("12/16 ");    mailcatcher = new Mailcatcher(driver);         mailcatcher.mailcatcherEmail();
    System.out.print("13/16 ");    loginPage = new LoginPage(driver);             loginPage.adshDialogCloseAndWindow();
    System.out.print("14/16 ");    headerBarPage = new HeaderBarPage(driver);     headerBarPage.logOut();
    System.out.print("15/16 ");    loginPage = new LoginPage(driver);             loginPage.loginSignIn(Maps.get_new_email("new_email"), Maps.getPassword("password"));
    System.out.print("16/16 ");    headerBarPage = new HeaderBarPage(driver);     headerBarPage.logOut();
  }

  @Test
  public void logInChangeEmail_2() {                            System.out.println("---------- TS_2 - TC_7 ----------");
    loginPage = new LoginPage(driver);
    loginPage.gotologinChangeEmail();
    loginPage.gotologinChangeEmail2("michal.michal@e11.click","2/7");
    loginPage.gotologinChangeEmail2("michal@e11.click.pl","3/7");
    loginPage.gotologinChangeEmail2("MiChAl@e11.click","4/7");
    loginPage.gotologinChangeEmail2("michal123@e11.click","5/7");
    loginPage.gotologinChangeEmail2("michal_123@e11.click","6/7");
    loginPage.gotologinChangeEmail2("111michal@e11.click","7/7");
  }
  @Test
  public void logInChangePassword1() {                           System.out.println("---------- TS_2 - TC_8 ----------");
    loginPage = new LoginPage(driver);
    loginPage.gotologinChangePassword();
    headerBarPage = new HeaderBarPage(driver);
    headerBarPage.logOut();
    loginPage.pageLayoutValidation();
    loginPage.loginSignIn(Maps.getEmail("email"), Maps.getPassword("password"));
    System.out.println("LoginEmail:  "+ Maps.getEmail("email"));
    System.out.println("NewPassword: "+ Maps.getPassword("password"));
  }
  @Test
  public void logInChangePassword2() {                           System.out.println("---------- TS_2 - TC_9 ----------");
    loginPage = new LoginPage(driver);
    loginPage.gotologinChangePassword2();
      }
  @Test
  public void logOutTest() {                                    System.out.println("---------- TS_2 - TC_10 ----------");
    headerBarPage = new HeaderBarPage(driver);
    headerBarPage.logOut();
  }
  @Test
  public void logInSecondTab() {                                System.out.println("---------- TS_2 - TC_11 ----------");
    loginPage = new LoginPage(driver);
    loginPage.loginSecondTab();
  }
  @Test
  public void logInSecondTab2() {                                System.out.println("---------- TS_2 TC_12 ----------");
    // TODO: 27.09.18 TS_2/TC_10 Error - remember me do not work
    loginPage = new LoginPage(driver);
    loginPage.loginSecondTab();
    loginPage.loginSecondTab2();
  }
  @Test
  public void logInSessionHoles() {                            System.out.println("---------- TS_2 - TC_13 ----------");
    loginPage = new LoginPage(driver);
    loginPage.loginSecondTab3();
  }
  @Test
  public void logInSecondTab4() {                              System.out.println("---------- TS_2 - TC_14 ----------");
    // TODO: 27.09.18 TS_2/TC_14 Error - session expiration not work - setting in file
    loginPage = new LoginPage(driver);
    loginPage.loginSecondTab4();
  }
  @Test
  public void changeOfRole()                                  {System.out.println("---------- TS_2 - TC_17 ----------");
                                          
  }

   @Test
  public void basicInformationSaveContinue() {                  System.out.println("---------- TS_3 - TC_1 ----------");
    advertiserMainPage = new AdvertiserMainPage(driver);
    advertiserMainPage.createNewCampaign();
    advertiserMainPage.basicInformation();
    advertiserMainPage.basicInformationSaveContinue();
  }
  @Test
  public void basicInformationBackToDashboard() {               System.out.println("---------- TS_3 - TC_2 ----------");
    advertiserMainPage = new AdvertiserMainPage(driver);
    advertiserMainPage.createNewCampaign();
    advertiserMainPage.basicInformation();
    advertiserMainPage.basicInformationBackToDashboard();
  }
  @Test
  public void additionalTargetingsaveSaveContinue() {           System.out.println("---------- TS_3 - TC_3 ----------");
    advertiserMainPage = new AdvertiserMainPage(driver);
    basicInformationSaveContinue();
    advertiserMainPage.additionalTargeting();
    advertiserMainPage.additionalTargetingsaveSaveContinue();
  }
  @Test
  public void additionalTargetingsaveSaveDraft() {             System.out.println("---------- TS_3 - TC_4 ----------");
    advertiserMainPage = new AdvertiserMainPage(driver);
    basicInformationSaveContinue();
    advertiserMainPage.additionalTargeting();
    advertiserMainPage.additionalTargetingsaveSaveDraft();
  }
  @Test
  public void additionalTargetingsaveBack() {                  System.out.println("---------- TS_3 - TC_5 ----------");
    advertiserMainPage = new AdvertiserMainPage(driver);
    basicInformationSaveContinue();
    advertiserMainPage.additionalTargeting();
    advertiserMainPage.additionalTargetingsaveBack();
  }
  @Test
  public void createAdsSaveContinue() {                        System.out.println("---------- TS_3 - TC_6 ----------");
    advertiserMainPage = new AdvertiserMainPage(driver);
    additionalTargetingsaveSaveContinue();
    advertiserMainPage.createAds();
    advertiserMainPage.createAdsSaveContinue();
    // TODO: 11.10.18 error - add jpg
  }
  @Test
  public void createAdsSaveDraft() {                           System.out.println("---------- TS_3 - TC_7 ----------");
    advertiserMainPage = new AdvertiserMainPage(driver);
    additionalTargetingsaveSaveContinue();
    advertiserMainPage.createAds();
    advertiserMainPage.createAdsSaveAsDraft();
  }
  @Test
  public void createAdsBack() {                                System.out.println("---------- TS_3 - TC_8 ----------");
    additionalTargetingsaveSaveContinue();
    advertiserMainPage.createAds();
    advertiserMainPage.createAdsBack();
  }
  @Test
  public void summarySaveContinue() {                          System.out.println("---------- TS_3 - TC_9 ----------");
    advertiserMainPage = new AdvertiserMainPage(driver);
    createAdsSaveContinue();
    advertiserMainPage.summary();
    advertiserMainPage.summarySaveContinue();
  }
  @Test
  public void summarySaveDraft() {                             System.out.println("---------- TS_3 - TC_10 ----------");
    advertiserMainPage = new AdvertiserMainPage(driver);
    createAdsSaveContinue();
    advertiserMainPage.summary();
    advertiserMainPage.summarySaveAsDraft();
  }
  @Test
  public void summaryBack() {                                  System.out.println("---------- TS_3 - TC_11 ----------");
    advertiserMainPage = new AdvertiserMainPage(driver);
    createAdsSaveContinue();
    advertiserMainPage.summary();
    advertiserMainPage.summaryBack();
  }
  @Test
  public void viewTheCampaign() {                              System.out.println("---------- TS_3 - TC_12 ----------");
    advertiserMainPage = new AdvertiserMainPage(driver);
    summarySaveContinue();
    advertiserMainPage.viewTheCampaign();
  }
  @Test
  public void editBasicInformation() {                         System.out.println("---------- TS_3 - TC_13 ----------");
    advertiserMainPage = new AdvertiserMainPage(driver);
    viewTheCampaign();
    advertiserMainPage.editTheCampaign();
    advertiserMainPage.editBasicInformation();
    advertiserMainPage.summary();
    advertiserMainPage.summarySaveContinue();
  }
  @Test
  public void editAdditionalTargeting() {                      System.out.println("---------- TS_3 - TC_14 ----------");
    advertiserMainPage = new AdvertiserMainPage(driver);
    viewTheCampaign();
    advertiserMainPage.editTheCampaign();
    advertiserMainPage.editAdditionalTargeting();
    advertiserMainPage.summary();
    advertiserMainPage.summarySaveContinue();
  }
  @Test
  public void editAds() {                                      System.out.println("---------- TS_3 - TC_15 ----------");
    advertiserMainPage = new AdvertiserMainPage(driver);
    viewTheCampaign();
    advertiserMainPage.editTheCampaign();
    advertiserMainPage.editAds();
    advertiserMainPage.summary();
    advertiserMainPage.summarySaveContinue();
  }
  @Test
  public void statusCampaign() {                               System.out.println("---------- TS_3 - TC_17 ----------");
    advertiserMainPage = new AdvertiserMainPage(driver);
    summarySaveContinue();
    advertiserMainPage.viewTheCampaign2();
    advertiserMainPage.statusCampaign();
    advertiserMainPage.viewTheCampaign2();
    advertiserMainPage.statusCampaign();
  }
  @Test
  public void basicInformationError() {                        System.out.println("---------- TS_3 - TC_19 ----------");
    advertiserMainPage = new AdvertiserMainPage(driver);
    advertiserMainPage.createNewCampaign();
    advertiserMainPage.basicInformationError();
  }
  @Test
  public void createAdsError() {                        System.out.println("---------- TS_3 - TC_20 ----------");
    advertiserMainPage = new AdvertiserMainPage(driver);
    additionalTargetingsaveSaveContinue();
    advertiserMainPage.createAdsError();
  }


  @Test
  public void publisherBasicInformationSaveContinue() {         System.out.println("---------- TS_4 - TC_1 ----------");
    publisherMainPage = new PublisherMainPage(driver);
    publisherMainPage.AddNewSite();
    publisherNewSite = new PublisherNewSite(driver);
    publisherNewSite.basicInformation();
    publisherNewSite.basicInformationSaveContinue();
  }
  @Test
  public void publisherBasicInformationBackToDashboard() {      System.out.println("---------- TS_4 - TC_2 ----------");
    publisherMainPage = new PublisherMainPage(driver);
    publisherMainPage.AddNewSite();
    publisherNewSite = new PublisherNewSite(driver);
    publisherNewSite.basicInformation();
    publisherNewSite.basicInformationBackToDashboard();
  }
  @Test
  public void publisherAdditionalTargetingsaveSaveContinue() {  System.out.println("---------- TS_4 - TC_3 ----------");
    publisherMainPage = new PublisherMainPage(driver);
    publisherBasicInformationSaveContinue();
    siteAdditionalTargeting = new SiteAdditionalTargeting(driver);
    siteAdditionalTargeting.publisherRequiresCreativeType();
    siteAdditionalTargeting.publisherRequiresLanguage();
//    siteAdditionalTargeting.publisherRequiresScreen();
    siteAdditionalTargeting.publisherRequiresJsSupport();
    siteAdditionalTargeting.additionalTargetingsaveSaveContinue();
  }
  @Test
  public void publisherAdditionalTargetingsaveSaveDraft() {     System.out.println("---------- TS_4 - TC_4 ----------");
    advertiserMainPage = new AdvertiserMainPage(driver);
    publisherBasicInformationSaveContinue();
    siteAdditionalTargeting = new SiteAdditionalTargeting(driver);
    siteAdditionalTargeting.publisherRequiresCreativeType();
    siteAdditionalTargeting.publisherRequiresLanguage();
//    siteAdditionalTargeting.publisherRequiresScreen();
    siteAdditionalTargeting.publisherRequiresJsSupport();
    siteAdditionalTargeting.additionalTargetingsaveSaveDraft();
  }
  @Test
  public void publisherAdditionalTargetingsaveBack() {           System.out.println("---------- TS_4 - TC_5 ----------");
    advertiserMainPage = new AdvertiserMainPage(driver);
    publisherBasicInformationSaveContinue();
    siteAdditionalTargeting = new SiteAdditionalTargeting(driver);
    siteAdditionalTargeting.publisherRequiresCreativeType();
    siteAdditionalTargeting.publisherRequiresLanguage();
//    siteAdditionalTargeting.publisherRequiresScreen();
    siteAdditionalTargeting.publisherRequiresJsSupport();
    siteAdditionalTargeting.additionalTargetingsaveBack();
  }
  // TODO: 16.10.18  SaveContinue SaveDraft
  @Test
  public void publisherCreateAdUnitsSaveContinue()          {  System.out.println("---------- TS_4 - TC_6 ----------");
    siteAdditionalTargeting = new SiteAdditionalTargeting(driver);
    publisherAdditionalTargetingsaveSaveContinue();
    siteCreateAds = new SiteCreateAds(driver);
    siteCreateAds.createNewAdUnit();
    siteCreateAds.adUnitImage();
    siteCreateAds.createAdUnitsSaveContinue();
  }
  @Test
  public void publisherCreateAdUnitsSaveDraft() {              System.out.println("---------- TS_4 - TC_7 ----------");
    siteAdditionalTargeting = new SiteAdditionalTargeting(driver);
    publisherAdditionalTargetingsaveSaveContinue();
    siteCreateAds = new SiteCreateAds(driver);
    siteCreateAds.createNewAdUnit();
    siteCreateAds.adUnitHtml();
    siteCreateAds.createAdUnitsSaveAsDraft();
  }
  @Test
  public void publisherCreateAdUnitsBack() {                   System.out.println("---------- TS_4 - TC_8 ----------");
    siteAdditionalTargeting = new SiteAdditionalTargeting(driver);
    publisherAdditionalTargetingsaveSaveContinue();
    siteCreateAds = new SiteCreateAds(driver);
    siteCreateAds.createNewAdUnit();
    siteCreateAds.adUnitImage();
    siteCreateAds.createAdUnitsBack();
  }
  @Test
  public void publisherSummaryPublishSite() {                  System.out.println("---------- TS_4 - TC_9 ----------");
    siteCreateAds = new SiteCreateAds(driver);
    publisherCreateAdUnitsSaveContinue();
    siteSummary = new SiteSummary(driver);
    siteSummary.summaryPublishSite();
  }
  @Test
  public void publisherSummarySaveDraft() {                    System.out.println("---------- TS_4 - TC_10 ----------");
    siteCreateAds = new SiteCreateAds(driver);
    publisherCreateAdUnitsSaveContinue();
    siteSummary = new SiteSummary(driver);
    siteSummary.summarySaveDraft();
  }
  @Test
  public void publisherSummaryBack() {                         System.out.println("---------- TS_4 - TC_11 ----------");
    siteCreateAds = new SiteCreateAds(driver);
    publisherCreateAdUnitsSaveContinue();
    siteSummary = new SiteSummary(driver);
    siteSummary.summaryBack();
  }
  @Test
  public void publisherViewSite() {                            System.out.println("---------- TS_4 - TC_12 ----------");
    siteSummary = new SiteSummary(driver);
    publisherSummaryPublishSite();
    publisherEditSite = new PublisherEditSite(driver);
    publisherEditSite.viewSite();
  }
  @Test
  public void publisherEditBasicInformation() {                System.out.println("---------- TS_4 - TC_13 ----------");
    siteSummary = new SiteSummary(driver);
    publisherSummaryPublishSite();
    publisherEditSite = new PublisherEditSite(driver);
    publisherEditSite.viewSite();
    publisherEditSite.editBasicInformation();
  }
  @Test
  public void publisherEditAdditionalTargeting() {             System.out.println("---------- TS_4 - TC_14 ----------");
    siteSummary = new SiteSummary(driver);
    publisherSummaryPublishSite();
    publisherEditSite = new PublisherEditSite(driver);
    publisherEditSite.viewSite();
    publisherEditSite.editAdditionalTargeting();
  }
  @Test
  public void publisherEditAds() {                             System.out.println("---------- TS_4 - TC_15 ----------");
    siteSummary = new SiteSummary(driver);
    publisherSummaryPublishSite();
    publisherEditSite = new PublisherEditSite(driver);
    publisherEditSite.viewSite();
    publisherEditSite.editAds();
  }
  @Test
  public void publisherBasicInformationError() {               System.out.println("---------- TS_4 - TC_19 ----------");
    publisherMainPage = new PublisherMainPage(driver);
    publisherMainPage.AddNewSite();
    publisherNewSite = new PublisherNewSite(driver);
    publisherNewSite.basicInformationError("");
  }
  @Test
  public void publisherCreateAdUnitsError() {               System.out.println("---------- TS_4 - TC_20 ----------");
    publisherMainPage = new PublisherMainPage(driver);
    publisherMainPage.AddNewSite();
    siteCreateAds = new SiteCreateAds(driver);
    publisherCreateAdUnitsSaveContinue();
    siteCreateAds.createAdUnitsError("");
  }
  @Test
  public void logInAdminEmail() {                              System.out.println("---------- TS_5 - TC_1 ----------");
    loginPage = new LoginPage(driver);
    loginPage.AdminEmail(admin,password_admin);
  }
  @Test
  public void advertiserTargetingAll() {                              System.out.println("---------- advertiserTargetingAll ----------");
    advertiserMainPage = new AdvertiserMainPage(driver);
    basicInformationSaveContinue();
    advertiserMainPage.additionalTargetingREQUIRED("Site","Site domain","coinmarketcap.com");
    advertiserMainPage.additionalTargetingREQUIRED("Site","Site domain","icoalert.com");
    advertiserMainPage.additionalTargetingREQUIRED("Site","Inside frame","Yes");
    advertiserMainPage.additionalTargetingREQUIRED("Site","Inside frame","No");
    advertiserMainPage.additionalTargetingREQUIRED("Site","Language","Polish");
    advertiserMainPage.additionalTargetingREQUIRED("Site","Language","English");
    advertiserMainPage.additionalTargetingREQUIRED("Site","Language","Italian");
    advertiserMainPage.additionalTargetingREQUIRED("Site","Language","Japanese");
    advertiserMainPage.additionalTargetingREQUIRED("Site","Content keywords","blockchain");
    advertiserMainPage.additionalTargetingREQUIRED("Site","Content keywords","ico");
    advertiserMainPage.additionalTargetingREQUIRED("User","Age","18-35");
    advertiserMainPage.additionalTargetingREQUIRED("User","Age","36-65");
    advertiserMainPage.additionalTargetingREQUIRED("User","Height","900 or more");
    advertiserMainPage.additionalTargetingREQUIRED("User","Height","between 200 and 300");
    advertiserMainPage.additionalTargetingREQUIRED("User","Interest keywords","blockchain");
    advertiserMainPage.additionalTargetingREQUIRED("User","Interest keywords","ico");
    advertiserMainPage.additionalTargetingREQUIRED("User","Language","Polish");
    advertiserMainPage.additionalTargetingREQUIRED("User","Language","English");
    advertiserMainPage.additionalTargetingREQUIRED("User","Language","Italian");
    advertiserMainPage.additionalTargetingREQUIRED("User","Language","Japanese");
    advertiserMainPage.additionalTargetingREQUIRED("User","Gender","Male");
    advertiserMainPage.additionalTargetingREQUIRED("User","Gender","Female");
    advertiserMainPage.additionalTargetingREQUIRED("User","Geo","Continent");
    advertiserMainPage.additionalTargetingREQUIRED("User","Geo","Country");
    advertiserMainPage.additionalTargetingREQUIRED("Device","Screen size","Width");
    advertiserMainPage.additionalTargetingREQUIRED("Device","Screen size","Height");
    advertiserMainPage.additionalTargetingREQUIRED("Device","Language","Polish");
    advertiserMainPage.additionalTargetingREQUIRED("Device","Language","English");
    advertiserMainPage.additionalTargetingREQUIRED("Device","Language","Italian");
    advertiserMainPage.additionalTargetingREQUIRED("Device","Language","Japanese");
    advertiserMainPage.additionalTargetingREQUIRED("Device","Browser","Chrome");
    advertiserMainPage.additionalTargetingREQUIRED("Device","Browser","Edge");
    advertiserMainPage.additionalTargetingREQUIRED("Device","Browser","Firefox");
    advertiserMainPage.additionalTargetingREQUIRED("Device","Operating system","Linux");
    advertiserMainPage.additionalTargetingREQUIRED("Device","Operating system","Mac");
    advertiserMainPage.additionalTargetingREQUIRED("Device","Operating system","Windows");
    advertiserMainPage.additionalTargetingREQUIRED("Device","Geo","Continent");
    advertiserMainPage.additionalTargetingREQUIRED("Device","Geo","Country");
    advertiserMainPage.additionalTargetingREQUIRED("Device","Javascript support","Yes");
    advertiserMainPage.additionalTargetingREQUIRED("Device","Javascript support","No");

    advertiserMainPage.additionalTargetingEXCLUDED("Site","Site domain","coinmarketcap.com");
    advertiserMainPage.additionalTargetingEXCLUDED("Site","Site domain","icoalert.com");
    advertiserMainPage.additionalTargetingEXCLUDED("Site","Inside frame","Yes");
    advertiserMainPage.additionalTargetingEXCLUDED("Site","Inside frame","No");
    advertiserMainPage.additionalTargetingEXCLUDED("Site","Language","Polish");
    advertiserMainPage.additionalTargetingEXCLUDED("Site","Language","English");
    advertiserMainPage.additionalTargetingEXCLUDED("Site","Language","Italian");
    advertiserMainPage.additionalTargetingEXCLUDED("Site","Language","Japanese");
    advertiserMainPage.additionalTargetingEXCLUDED("Site","Content keywords","blockchain");
    advertiserMainPage.additionalTargetingEXCLUDED("Site","Content keywords","ico");
    advertiserMainPage.additionalTargetingEXCLUDED("User","Age","18-35");
    advertiserMainPage.additionalTargetingEXCLUDED("User","Age","36-65");
    advertiserMainPage.additionalTargetingEXCLUDED("User","Height","900 or more");
    advertiserMainPage.additionalTargetingEXCLUDED("User","Height","between 200 and 300");
    advertiserMainPage.additionalTargetingEXCLUDED("User","Interest keywords","blockchain");
    advertiserMainPage.additionalTargetingEXCLUDED("User","Interest keywords","ico");
    advertiserMainPage.additionalTargetingEXCLUDED("User","Language","Polish");
    advertiserMainPage.additionalTargetingEXCLUDED("User","Language","English");
    advertiserMainPage.additionalTargetingEXCLUDED("User","Language","Italian");
    advertiserMainPage.additionalTargetingEXCLUDED("User","Language","Japanese");
    advertiserMainPage.additionalTargetingEXCLUDED("User","Gender","Male");
    advertiserMainPage.additionalTargetingEXCLUDED("User","Gender","Female");
    advertiserMainPage.additionalTargetingEXCLUDED("User","Geo","Continent");
    advertiserMainPage.additionalTargetingEXCLUDED("User","Geo","Country");
    advertiserMainPage.additionalTargetingEXCLUDED("Device","Screen size","Width");
    advertiserMainPage.additionalTargetingEXCLUDED("Device","Screen size","Height");
    advertiserMainPage.additionalTargetingEXCLUDED("Device","Language","Polish");
    advertiserMainPage.additionalTargetingEXCLUDED("Device","Language","English");
    advertiserMainPage.additionalTargetingEXCLUDED("Device","Language","Italian");
    advertiserMainPage.additionalTargetingEXCLUDED("Device","Language","Japanese");
    advertiserMainPage.additionalTargetingEXCLUDED("Device","Browser","Chrome");
    advertiserMainPage.additionalTargetingEXCLUDED("Device","Browser","Edge");
    advertiserMainPage.additionalTargetingEXCLUDED("Device","Browser","Firefox");
    advertiserMainPage.additionalTargetingEXCLUDED("Device","Operating system","Linux");
    advertiserMainPage.additionalTargetingEXCLUDED("Device","Operating system","Mac");
    advertiserMainPage.additionalTargetingEXCLUDED("Device","Operating system","Windows");
    advertiserMainPage.additionalTargetingEXCLUDED("Device","Geo","Continent");
    advertiserMainPage.additionalTargetingEXCLUDED("Device","Geo","Country");
    advertiserMainPage.additionalTargetingEXCLUDED("Device","Javascript support","Yes");
    advertiserMainPage.additionalTargetingEXCLUDED("Device","Javascript support","No");
  }
  @Test
  public void publisherTargetingAll() {                              System.out.println("---------- publisherTargetingAll ----------");
    advertiserMainPage = new AdvertiserMainPage(driver);
    publisherBasicInformationSaveContinue();
    publisherMainPage = new PublisherMainPage(driver);
    publisherMainPage.additionalTargetingREQUIRED("Creative type","Audio Ad (Auto-Play)");
    publisherMainPage.additionalTargetingREQUIRED("Creative type","Audio Ad (User Initiated)");
    publisherMainPage.additionalTargetingREQUIRED("Creative type","In-Banner Video Ad (Auto-Play)");
    publisherMainPage.additionalTargetingREQUIRED("Creative type","In-Banner Video Ad (User Initiated)");
    publisherMainPage.additionalTargetingREQUIRED("Creative type","Provocative or Suggestive Imagery");
    publisherMainPage.additionalTargetingREQUIRED("Creative type","Shaky, Flashing, Flickering, Extreme Animation, Smileys");
    publisherMainPage.additionalTargetingREQUIRED("Creative type","Surveys");
    publisherMainPage.additionalTargetingREQUIRED("Creative type","Text Only");
    publisherMainPage.additionalTargetingREQUIRED("Creative type","User Interactive (e.g., Embedded Games)");
    publisherMainPage.additionalTargetingREQUIRED("Creative type","Windows Dialog or Alert Style");
    publisherMainPage.additionalTargetingREQUIRED("Creative type","Has Audio On/Off Button");
    publisherMainPage.additionalTargetingREQUIRED("Language","Polish");
    publisherMainPage.additionalTargetingREQUIRED("Language","English");
    publisherMainPage.additionalTargetingREQUIRED("Language","Italian");
    publisherMainPage.additionalTargetingREQUIRED("Language","Japanese");
    publisherMainPage.additionalTargetingREQUIRED("Browser","Firefox");
    publisherMainPage.additionalTargetingREQUIRED("Browser","Chrome");
    publisherMainPage.additionalTargetingREQUIRED("Browser","Safari");
    publisherMainPage.additionalTargetingREQUIRED("Browser","Edge");
    publisherMainPage.additionalTargetingREQUIRED("Javascript support","Yes");
    publisherMainPage.additionalTargetingREQUIRED("Javascript support","No");

    publisherMainPage.additionalTargetingEXCLUDED("Creative type","Audio Ad (Auto-Play)");
    publisherMainPage.additionalTargetingEXCLUDED("Creative type","Audio Ad (User Initiated)");
    publisherMainPage.additionalTargetingEXCLUDED("Creative type","In-Banner Video Ad (Auto-Play)");
    publisherMainPage.additionalTargetingEXCLUDED("Creative type","In-Banner Video Ad (User Initiated)");
    publisherMainPage.additionalTargetingEXCLUDED("Creative type","Provocative or Suggestive Imagery");
    publisherMainPage.additionalTargetingEXCLUDED("Creative type","Shaky, Flashing, Flickering, Extreme Animation, Smileys");
    publisherMainPage.additionalTargetingEXCLUDED("Creative type","Surveys");
    publisherMainPage.additionalTargetingEXCLUDED("Creative type","Text Only");
    publisherMainPage.additionalTargetingEXCLUDED("Creative type","User Interactive (e.g., Embedded Games)");
    publisherMainPage.additionalTargetingEXCLUDED("Creative type","Windows Dialog or Alert Style");
    publisherMainPage.additionalTargetingEXCLUDED("Creative type","Has Audio On/Off Button");
    publisherMainPage.additionalTargetingEXCLUDED("Language","Polish");
    publisherMainPage.additionalTargetingEXCLUDED("Language","English");
    publisherMainPage.additionalTargetingEXCLUDED("Language","Italian");
    publisherMainPage.additionalTargetingEXCLUDED("Language","Japanese");
    publisherMainPage.additionalTargetingEXCLUDED("Browser","Firefox");
    publisherMainPage.additionalTargetingEXCLUDED("Browser","Chrome");
    publisherMainPage.additionalTargetingEXCLUDED("Browser","Safari");
    publisherMainPage.additionalTargetingEXCLUDED("Browser","Edge");
    publisherMainPage.additionalTargetingEXCLUDED("Javascript support","Yes");
    publisherMainPage.additionalTargetingEXCLUDED("Javascript support","No");
  }
}
