package pl.adshares.adpanel.tools;
import java.util.HashMap;

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

}
