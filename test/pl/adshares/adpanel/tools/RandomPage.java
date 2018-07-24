package pl.adshares.adpanel.tools;

import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.testng.log4testng.Logger;

import java.util.HashMap;
import java.util.Random;

public class RandomPage {

  private static HashMap store;

  public static void create() {
    store = new HashMap();
  }

  public static void store(String name, String value) {
    store.put(name, value);
  }


  public static Object getFromStore(String name) {
    return store.get(name);
  }
//  public static String getFromStore(String name) {
//    return String.valueOf(store.get(name));
//  }

}
